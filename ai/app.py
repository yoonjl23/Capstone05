import os
import io
import logging
import traceback
import base64

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import timm
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import hf_hub_download

# ── 로깅 설정 ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# ── 설정 ───────────────────────────────────────────────────
HF_REPO_ID = os.environ.get("HF_REPO_ID", "Ajelly/Capstone05-models")  # 본인 repo로 변경

def get_model_path(filename: str) -> str:
    """로컬에 있으면 로컬 사용, 없으면 HuggingFace에서 자동 다운로드"""
    if os.path.exists(filename):
        logger.info(f"Using local model: {filename}")
        return filename
    logger.info(f"Downloading {filename} from HuggingFace repo: {HF_REPO_ID} ...")
    return hf_hub_download(repo_id=HF_REPO_ID, filename=filename)

SWIN_PATH     = os.environ.get("SWIN_PATH",     get_model_path("best_model_4class_swin_v2.pth"))
CONVNEXT_PATH = os.environ.get("CONVNEXT_PATH", get_model_path("best_model_4class_convnext.pth"))
DEVICE        = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE    = 224

EMOTION_NAMES = ["positive", "negative", "neutral", "surprise"]
EMOTION_KR    = ["긍정", "부정", "중립", "놀람"]

logger.info(f"Using device: {DEVICE}")

# ── 모델 아키텍처 정의 (학습 코드와 동일하게 유지) ──────────

class SwinModel(nn.Module):
    def __init__(self, num_classes=4, dropout=0.3):
        super().__init__()
        self.backbone = timm.create_model(
            'swin_base_patch4_window7_224',
            pretrained=False,
            num_classes=0,
            global_pool='avg'
        )
        feature_dim = self.backbone.num_features  # 1024

        for stage in list(self.backbone.layers)[:2]:
            for param in stage.parameters():
                param.requires_grad = False

        self.classifier = nn.Sequential(
            nn.LayerNorm(feature_dim),
            nn.Dropout(dropout),
            nn.Linear(feature_dim, 256),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(256, num_classes)
        )
        for m in self.classifier.modules():
            if isinstance(m, nn.Linear):
                nn.init.trunc_normal_(m.weight, std=0.02)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)

    def forward(self, x):
        return self.classifier(self.backbone(x))


class ConvNeXtModel(nn.Module):
    def __init__(self, num_classes=4, dropout=0.3):
        super().__init__()
        self.backbone = timm.create_model(
            'convnext_base',
            pretrained=False,
            num_classes=0,
            global_pool='avg'
        )
        feature_dim = self.backbone.num_features  # 1024

        for stage in list(self.backbone.stages)[:2]:
            for param in stage.parameters():
                param.requires_grad = False

        self.classifier = nn.Sequential(
            nn.LayerNorm(feature_dim),
            nn.Dropout(dropout),
            nn.Linear(feature_dim, 256),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(256, num_classes)
        )
        for m in self.classifier.modules():
            if isinstance(m, nn.Linear):
                nn.init.trunc_normal_(m.weight, std=0.02)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)

    def forward(self, x):
        return self.classifier(self.backbone(x))


class EnsembleModel(nn.Module):
    def __init__(self, swin: nn.Module, convnext: nn.Module, swin_weight=0.5):
        super().__init__()
        self.swin       = swin
        self.convnext   = convnext
        self.swin_w     = swin_weight
        self.convnext_w = 1.0 - swin_weight

    def forward(self, x):
        prob_s = F.softmax(self.swin(x),     dim=1)
        prob_c = F.softmax(self.convnext(x), dim=1)
        return self.swin_w * prob_s + self.convnext_w * prob_c


# ── 모델 로딩 ──────────────────────────────────────────────

def _load_single(ModelClass, path: str):
    logger.info(f"  Loading {ModelClass.__name__} from: {path}")
    ckpt = torch.load(path, map_location=DEVICE, weights_only=False)
    saved_en = ckpt.get("emotion_names", EMOTION_NAMES)
    saved_kr = ckpt.get("emotion_kr",    EMOTION_KR)
    num_cls  = len(saved_en)
    logger.info(f"    val_acc={ckpt.get('val_acc','N/A')} | epoch={ckpt.get('epoch','N/A')} | classes={saved_en}")
    m = ModelClass(num_classes=num_cls)
    m.load_state_dict(ckpt["model_state_dict"])
    m.to(DEVICE)
    m.eval()
    return m, saved_en, saved_kr


def load_ensemble(swin_path: str, convnext_path: str):
    logger.info("Loading ensemble models...")
    swin_model,     en_s, kr_s = _load_single(SwinModel,     swin_path)
    convnext_model, en_c, kr_c = _load_single(ConvNeXtModel, convnext_path)
    if en_s != en_c:
        logger.warning(f"Class mismatch! Swin={en_s}, ConvNext={en_c}. Using Swin classes.")
    ensemble = EnsembleModel(swin=swin_model, convnext=convnext_model)
    logger.info("Ensemble ready.")
    return ensemble, en_s, kr_s


# ── 전처리 파이프라인 ───────────────────────────────────────

def get_transform() -> transforms.Compose:
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std =[0.229, 0.224, 0.225],
        ),
    ])


# ── 전역 인스턴스 ───────────────────────────────────────────

model: nn.Module       = None
emotion_names_en: list = EMOTION_NAMES
emotion_names_kr: list = EMOTION_KR
transform = get_transform()

try:
    model, emotion_names_en, emotion_names_kr = load_ensemble(SWIN_PATH, CONVNEXT_PATH)
except Exception as e:
    logger.error(f"Model load failed: {e}\n{traceback.format_exc()}")
    logger.warning("Server will start without a loaded model. /predict will return 503.")


# ── 공용 추론 함수 ──────────────────────────────────────────

def _infer(image: Image.Image) -> dict:
    """PIL Image → 추론 결과 dict"""
    tensor = transform(image).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        probs = model(tensor).squeeze(0).cpu()
    idx        = int(probs.argmax())
    confidence = float(probs[idx])
    return {
        "emotion":       emotion_names_kr[idx],
        "emotion_en":    emotion_names_en[idx],
        "emotion_index": idx,
        "confidence":    round(confidence, 4),
        "probabilities": {
            emotion_names_kr[i]: round(float(probs[i]), 4)
            for i in range(len(emotion_names_en))
        },
    }


# ── Flask 앱 ───────────────────────────────────────────────

app = Flask(__name__)
CORS(app)   # React(브라우저) 직접 호출 허용


@app.route("/health", methods=["GET"])
def health():
    status = "ok" if model is not None else "model_not_loaded"
    return jsonify({"status": status, "device": str(DEVICE)}), 200


@app.route("/predict", methods=["POST"])
def predict():
    """기존 엔드포인트 — multipart/form-data 또는 raw bytes"""
    if model is None:
        return jsonify({"error": "Model is not loaded"}), 503
    try:
        if request.content_type and "multipart" in request.content_type:
            if "image" not in request.files:
                return jsonify({"error": "No 'image' field in form-data"}), 400
            file_bytes = request.files["image"].read()
        else:
            file_bytes = request.get_data()
            if not file_bytes:
                return jsonify({"error": "Empty request body"}), 400
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    try:
        result = _infer(image)
        logger.info(f"[predict] {result['emotion']} ({result['confidence']:.2%})")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Inference error: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500


@app.route("/predict/frame", methods=["POST"])
def predict_frame():
    """
    실시간 웹캠 프레임 전용 엔드포인트
    React canvas.toDataURL()로 캡처한 base64 이미지를 받아 추론

    요청 (JSON):
      { "image": "data:image/jpeg;base64,/9j/4AAQ..." }

    응답 (JSON):
      { "emotion": "긍정", "emotion_en": "positive",
        "emotion_index": 0, "confidence": 0.87 }
    """
    if model is None:
        return jsonify({"error": "Model is not loaded"}), 503

    # ── base64 이미지 파싱 ───────────────────────────────
    try:
        data = request.get_json(force=True)
        if not data or "image" not in data:
            return jsonify({"error": "Missing 'image' field"}), 400

        b64_str = data["image"]
        if "," in b64_str:                        # data:image/jpeg;base64,xxx → xxx
            b64_str = b64_str.split(",", 1)[1]

        img_bytes = base64.b64decode(b64_str)
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid frame data: {str(e)}"}), 400

    # ── 추론 (probabilities 생략 — 실시간 지연 최소화) ──
    try:
        result = _infer(image)
        return jsonify({
            "emotion":       result["emotion"],
            "emotion_en":    result["emotion_en"],
            "emotion_index": result["emotion_index"],
            "confidence":    result["confidence"],
        }), 200
    except Exception as e:
        logger.error(f"Frame inference error: {e}")
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500


@app.route("/model-info", methods=["GET"])
def model_info():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    return jsonify({
        "classes":     emotion_names_en,
        "classes_kr":  emotion_names_kr,
        "num_classes": len(emotion_names_en),
        "image_size":  IMAGE_SIZE,
        "device":      str(DEVICE),
    }), 200


# ── 진입점 ─────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)