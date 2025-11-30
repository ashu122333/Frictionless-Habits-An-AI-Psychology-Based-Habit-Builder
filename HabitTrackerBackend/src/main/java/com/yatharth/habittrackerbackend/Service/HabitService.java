package com.yatharth.habittrackerbackend.Service;

import com.yatharth.habittrackerbackend.DTOs.HabitDto;
import com.yatharth.habittrackerbackend.DTOs.HabitMapper;
import com.yatharth.habittrackerbackend.DTOs.HabitPostRequest;
import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Model.HabitLog;
import com.yatharth.habittrackerbackend.Model.HabitStatus;
import com.yatharth.habittrackerbackend.Model.User;
import com.yatharth.habittrackerbackend.Repository.HabitLogRepository;
import com.yatharth.habittrackerbackend.Repository.HabitRepository;
import com.yatharth.habittrackerbackend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HabitService {
    private final HabitRepository habitRepo;
    private final UserRepository userRepo;
    private final HabitLogRepository habitLogRepo;

    public HabitService(HabitRepository habitRepo, UserRepository userRepo, HabitLogRepository habitLogRepo){
        this.habitRepo = habitRepo;
        this.userRepo = userRepo;
        this.habitLogRepo = habitLogRepo;
    }

    public ResponseEntity<HabitDto> createHabit(HabitPostRequest req, String username) {
        User user = userRepo.findByUsername(username).orElse(null);
        Habit habit = Habit.builder()
                .title(req.title())
                .category(req.category())
                .type(req.type())
                .user(user)
                .build();

        habitRepo.save(habit);

        return new ResponseEntity<>(HabitMapper.toDto(habit), HttpStatus.CREATED);
    }

    public ResponseEntity<List<HabitDto>> getHabits(String username) {
        List<HabitDto> habits = habitRepo.findByUserUsername(username)
                .stream()
                .map(HabitMapper::toDto)
                .toList();

        return ResponseEntity.ok(habits);
    }

    public ResponseEntity<String> deleteHabit(Integer id, String username) {
        Habit habit = habitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getUsername().equals(username))
            throw new RuntimeException("Unauthorized");
        habitRepo.deleteById(id);
        return ResponseEntity.ok("success");
    }
}
