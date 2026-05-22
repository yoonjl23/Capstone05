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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {

    private static final String COLLECTION_CODE_PREFIX = "BOOK_";

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final CharacterCardRepository characterCardRepository;
    private final UserCharacterRepository userCharacterRepository;

    public record ProgressUpdate(UserProgress progress, List<ProgressDto.CharacterDto> newlyUnlockedCharacters) {
    }

    public ProgressDto.ProgressResponse getProgress(Long userId) {
        User user = getUser(userId);
        UserProgress progress = getOrCreateProgress(user);
        unlockAvailableCharacters(user, progress.getLevel());

        List<UserCharacter> unlockedCharacters = userCharacterRepository.findByUserId(userId);
        Set<Long> unlockedIds = new HashSet<>(unlockedCharacters.stream()
                .map(userCharacter -> userCharacter.getCharacterCard().getId())
                .toList());
        Map<Long, LocalDateTime> unlockedAtByCardId = unlockedCharacters.stream()
                .collect(Collectors.toMap(
                        userCharacter -> userCharacter.getCharacterCard().getId(),
                        UserCharacter::getUnlockedAt,
                        (left, right) -> left
                ));

        List<ProgressDto.CharacterDto> characters = getCollectionCards().stream()
                .map(card -> toCharacterDto(card, unlockedIds.contains(card.getId()), unlockedAtByCardId.get(card.getId())))
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
        unlockAvailableCharacters(user, progress.getLevel());

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
    public ProgressUpdate addExp(User user, int exp) {
        UserProgress progress = getOrCreateProgress(user);
        progress.setTotalExp(progress.getTotalExp() + exp);
        progress.setLevel(calculateLevel(progress.getTotalExp()));

        List<UserCharacter> newlyUnlocked = unlockAvailableCharacters(user, progress.getLevel());
        List<ProgressDto.CharacterDto> newlyUnlockedCharacters = newlyUnlocked.stream()
                .map(userCharacter -> toCharacterDto(
                        userCharacter.getCharacterCard(),
                        true,
                        userCharacter.getUnlockedAt()
                ))
                .toList();

        return new ProgressUpdate(progress, newlyUnlockedCharacters);
    }

    private int calculateLevel(int totalExp) {
        return Math.max(1, totalExp / 50 + 1);
    }

    private int requiredExpForNextLevel(int currentLevel) {
        return currentLevel * 50;
    }

    @Transactional
    public List<UserCharacter> unlockAvailableCharacters(User user, int level) {
        List<UserCharacter> newlyUnlocked = new ArrayList<>();

        for (CharacterCard card : getCollectionCards()) {
            if (card.getRequiredLevel() <= level
                    && !userCharacterRepository.existsByUserIdAndCharacterCardId(user.getId(), card.getId())) {
                newlyUnlocked.add(userCharacterRepository.save(UserCharacter.builder()
                        .user(user)
                        .characterCard(card)
                        .build()));
            }
        }

        return newlyUnlocked;
    }

    private List<CharacterCard> getCollectionCards() {
        return characterCardRepository.findByCodeStartingWithOrderByRequiredLevelAsc(COLLECTION_CODE_PREFIX);
    }

    private ProgressDto.CharacterDto toCharacterDto(CharacterCard card, boolean unlocked, LocalDateTime unlockedAt) {
        return ProgressDto.CharacterDto.builder()
                .id(card.getId())
                .code(card.getCode())
                .name(card.getName())
                .requiredLevel(card.getRequiredLevel())
                .themeCode(card.getThemeCode())
                .imageName(card.getImageName())
                .unlocked(unlocked)
                .unlockedAt(unlockedAt)
                .build();
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }
}
