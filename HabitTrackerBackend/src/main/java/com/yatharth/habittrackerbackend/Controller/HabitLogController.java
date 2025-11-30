package com.yatharth.habittrackerbackend.Controller;

import com.yatharth.habittrackerbackend.DTOs.HabitLogDto;
import com.yatharth.habittrackerbackend.Service.HabitLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/habits/logs")
@RequiredArgsConstructor
public class HabitLogController {

    private final HabitLogService logService;

    // Mark habit as completed today
    @PostMapping("/{habitId}/complete")
    public ResponseEntity<String> completeHabit(@PathVariable Integer habitId, Principal principal) {
        logService.completeHabit(habitId, principal.getName());
        return ResponseEntity.ok("Habit marked as completed");
    }

    // Mark habit as skipped today
    @PostMapping("/{habitId}/skip")
    public ResponseEntity<String> skipHabit(@PathVariable Integer habitId, Principal principal) {
        logService.skipHabit(habitId, principal.getName());
        return ResponseEntity.ok("Habit marked as skipped");
    }

    //Set logs for failed, or etc
    @PostMapping("{habitId}/status")
    public ResponseEntity<String> habitStatus(@PathVariable Integer habitId, @RequestParam String value, Principal principal){
        logService.habitStatus(habitId, value, principal.getName());
        return ResponseEntity.ok("Habit Marked as "+ value);
    }

    //Get today's log
    @GetMapping("{habitId}/today")
    public ResponseEntity<String> getTodayStatus(@PathVariable Integer habitId, Principal principal){
        return ResponseEntity.ok(logService.getTodayStatus(habitId, principal.getName()));
    }

    // Get logs for calendar (LeetCode style)
    @GetMapping("/{habitId}/calendar")
    public ResponseEntity<List<HabitLogDto>> getCalendarLogs(
            @PathVariable Integer habitId,
            Principal principal) {

        return ResponseEntity.ok(logService.getHabitLogs(habitId, principal.getName()));
    }

    // Get current streak of habit
    @GetMapping("/{habitId}/streak")
    public ResponseEntity<Integer> getStreak(
            @PathVariable Integer habitId,
            Principal principal) {

        return ResponseEntity.ok(logService.getStreak(habitId, principal.getName()));
    }
}
