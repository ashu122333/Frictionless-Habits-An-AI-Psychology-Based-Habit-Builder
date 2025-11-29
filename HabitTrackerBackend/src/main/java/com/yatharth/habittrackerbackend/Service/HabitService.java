package com.yatharth.habittrackerbackend.Service;

import com.yatharth.habittrackerbackend.DTOs.HabitDto;
import com.yatharth.habittrackerbackend.DTOs.HabitMapper;
import com.yatharth.habittrackerbackend.DTOs.HabitPostRequest;
import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Model.User;
import com.yatharth.habittrackerbackend.Repository.HabitRepository;
import com.yatharth.habittrackerbackend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HabitService {
    private final HabitRepository habitRepo;
    private final UserRepository userRepo;

    public HabitService(HabitRepository habitRepo, UserRepository userRepo){
        this.habitRepo = habitRepo;
        this.userRepo = userRepo;
    }

    public ResponseEntity<HabitDto> createHabit(HabitPostRequest request, String username) {
        User user = userRepo.findByUsername(username).orElse(null);
        Habit habit = new Habit();
        habit.setCategory(request.Category());
        habit.setTitle(request.title());
        habit.setType(request.type());
        habit.setUser(user);
        habit = habitRepo.save(habit);

        return new ResponseEntity<>(HabitMapper.toDto(habit), HttpStatus.CREATED);
    }

    public ResponseEntity<List<HabitDto>> getHabits(String username) {
        List<HabitDto> habits = habitRepo.findByUserUsername(username)
                .stream()
                .map(HabitMapper::toDto)
                .toList();

        return ResponseEntity.ok(habits);
    }

    public ResponseEntity<String> deleteHabit(Integer id) {
        habitRepo.deleteById(id);
        return ResponseEntity.ok("success");
    }
}
