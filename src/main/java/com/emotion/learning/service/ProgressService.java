package com.emotion.learning.service;

import com.emotion.learning.dto.ProgressDto;
import com.emotion.learning.dto.UserProfileDto;
import com.emotion.learning.entity.CharacterCard;
import com.emotion.learning.entity.User;
import com.emotion.learning.entity.UserCharacter;
import com.emotion.learning.entity.UserProgress;
import com.emotion.learning.exception.ApiException;
import com.emotion.learning.repository.CharacterCardRepository;
import com.emotion.learning.repository.UserCharacterRepository;
import com.emotion.learning.repository.UserProgressRepository;
import com.emotion.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final CharacterCardRepository characterCardRepository;
    private final UserCharacterRepository userCharacterRepository;

    public ProgressDto.ProgressResponse getProgress(Long userId) {
        User user = getUser(userId);
        UserProgress progress = getOrCreateProgress(user);
        Set<Long> unlockedIds = new HashSet<>(userCharacterRepository.findByUserId(userId)
                .stream().map(uc -> uc.getCharacterCard().getId()).toList());

        List<ProgressDto.CharacterDto> characters = characterCardRepository.findAll().stream()
                .map(card -> ProgressDto.CharacterDto.builder()
                        .id(card.getId())
                        .code(card.getCode())
                        .name(card.getName())
                        .requiredLevel(card.getRequiredLevel())
                        .unlocked(unlockedIds.contains(card.getId()))
                        .build())
                .toList();

        return ProgressDto.ProgressResponse.builder()
                .userId(userId)
                .level(progress.getLevel())
                .totalExp(progress.getTotalExp())
                .nextLevelExp(requiredExpForNextLevel(progress.getLevel()))
                .characters(characters)
                .build();
    }

    public UserProfileDto getProfileByUserId(String loginId) {
        User user = userRepository.findByUserId(loginId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        UserProgress progress = getOrCreateProgress(user);
        return UserProfileDto.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .username(user.getUsername())
                .level(progress.getLevel())
                .totalExp(progress.getTotalExp())
                .build();
    }

    @Transactional
    public UserProgress getOrCreateProgress(User user) {
        return userProgressRepository.findByUserId(user.getId())
                .orElseGet(() -> userProgressRepository.save(UserProgress.builder()
                        .user(user)
                        .totalExp(0)
                        .level(1)
                        .build()));
    }

    @Transactional
    public UserProgress addExp(User user, int exp) {
        UserProgress progress = getOrCreateProgress(user);
        progress.setTotalExp(progress.getTotalExp() + exp);
        progress.setLevel(calculateLevel(progress.getTotalExp()));
        unlockAvailableCharacters(user, progress.getLevel());
        return progress;
    }

    private int calculateLevel(int totalExp) {
        return Math.max(1, totalExp / 50 + 1);
    }

    private int requiredExpForNextLevel(int currentLevel) {
        return currentLevel * 50;
    }

    @Transactional
    public void unlockAvailableCharacters(User user, int level) {
        List<CharacterCard> allCards = characterCardRepository.findAll();
        for (CharacterCard card : allCards) {
            if (card.getRequiredLevel() <= level && !userCharacterRepository.existsByUserIdAndCharacterCardId(user.getId(), card.getId())) {
                userCharacterRepository.save(UserCharacter.builder()
                        .user(user)
                        .characterCard(card)
                        .build());
            }
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }
}
