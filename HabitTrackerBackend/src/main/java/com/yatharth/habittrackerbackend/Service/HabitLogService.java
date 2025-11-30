package com.yatharth.habittrackerbackend.Service;

import com.yatharth.habittrackerbackend.DTOs.HabitLogDto;
import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Model.HabitLog;
import com.yatharth.habittrackerbackend.Model.HabitStatus;
import com.yatharth.habittrackerbackend.Model.User;
import com.yatharth.habittrackerbackend.Repository.HabitLogRepository;
import com.yatharth.habittrackerbackend.Repository.HabitRepository;
import com.yatharth.habittrackerbackend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitLogService {

    private final HabitRepository habitRepo;
    private final HabitLogRepository logRepo;
    private final UserRepository userRepo;

    // Mark habit completed today
    public void completeHabit(Integer habitId, String username) {
        Habit habit = validateHabitOwner(habitId, username);

        HabitLog log = logRepo.findByHabitAndDate(habit, LocalDate.now())
                .orElse(HabitLog.builder()
                        .habit(habit)
                        .date(LocalDate.now())
                        .build());

        log.setStatus(HabitStatus.COMPLETED);

        logRepo.save(log);
    }

    // Mark skipped
    public void skipHabit(Integer habitId, String username) {
        Habit habit = validateHabitOwner(habitId, username);

        HabitLog log = logRepo.findByHabitAndDate(habit, LocalDate.now())
                .orElse(HabitLog.builder()
                        .habit(habit)
                        .date(LocalDate.now())
                        .build());

        log.setStatus(HabitStatus.SKIPPED);

        logRepo.save(log);
    }

    public void habitStatus(Integer habitId, String value, String username) {
        Habit habit = validateHabitOwner(habitId, username);

        String statusValue = value.toUpperCase();

        HabitStatus status;
        try{
            status = HabitStatus.valueOf(statusValue);
        } catch (IllegalArgumentException e){
            throw new RuntimeException("Invalid habit Status" + value);
        }

        HabitLog log = logRepo.findByHabitAndDate(habit, LocalDate.now())
                .orElse(HabitLog.builder()
                        .habit(habit)
                        .date(LocalDate.now())
                        .build());

        log.setStatus(status);
        logRepo.save(log);
    }

    // Get streak for a habit
    public int getStreak(Integer habitId, String username) {
        Habit habit = validateHabitOwner(habitId, username);

        List<HabitLog> logs = logRepo.findByHabitOrderByDateDesc(habit);

        int streak = 0;
        LocalDate pointer = LocalDate.now();

        for (HabitLog log : logs) {
            if (log.getDate().equals(pointer) && log.getStatus() == HabitStatus.COMPLETED) {
                streak++;
                pointer = pointer.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }

    public @Nullable String getTodayStatus(Integer habitId, String username) {
        Habit habit = validateHabitOwner(habitId, username);
        LocalDate todayDate = LocalDate.now();
        Optional<HabitLog> log = logRepo.findByHabitAndDate(habit, todayDate);

        return log.map(habitLog -> habitLog.getStatus().name()).orElseGet(HabitStatus.PENDING::name);

    }

    // Get logs for calendar
    public List<HabitLogDto> getHabitLogs(Integer habitId, String username) {
        Habit habit = validateHabitOwner(habitId, username);
        return logRepo.findByHabit(habit)
                .stream()
                .map(HabitLogDto::from)
                .toList();
    }

    // Check habit belongs to the user
    private Habit validateHabitOwner(Integer habitId, String username) {
        User user = userRepo.findByUsername(username).get();

        Habit habit = habitRepo.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized access");

        return habit;
    }

}
