package com.yatharth.habittrackerbackend.Repository;

import com.yatharth.habittrackerbackend.Model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Integer> {
    List<Habit> findByUserUsername(String username);
}
