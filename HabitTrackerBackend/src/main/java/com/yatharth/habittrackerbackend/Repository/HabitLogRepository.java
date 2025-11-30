package com.yatharth.habittrackerbackend.Repository;

import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Model.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Integer> {
    List<HabitLog> findByHabitOrderByDateDesc(Habit habit);
    Optional<HabitLog> findByHabitAndDate(Habit habit, LocalDate localDate);
    List<HabitLog> findByHabit(Habit habit);
}
