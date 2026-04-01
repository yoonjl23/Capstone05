export const mockApi = {
    login: () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 800)
      }),
  
    analyzeEmotion: () =>
      new Promise((resolve) => {
        const emotions = [
          { label: '기쁨', color: 'bg-yellow-400', icon: '😊', border: 'border-yellow-200' },
          { label: '슬픔', color: 'bg-blue-400', icon: '😢', border: 'border-blue-200' },
          { label: '화남', color: 'bg-red-400', icon: '😠', border: 'border-red-200' },
          { label: '놀람', color: 'bg-purple-400', icon: '😲', border: 'border-purple-200' },
        ]
  
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        resolve(randomEmotion)
      }),
  }