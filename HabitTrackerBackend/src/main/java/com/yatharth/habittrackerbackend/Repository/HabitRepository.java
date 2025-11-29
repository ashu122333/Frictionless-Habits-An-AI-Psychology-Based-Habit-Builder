package com.yatharth.habittrackerbackend.Repository;

import com.yatharth.habittrackerbackend.Model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Integer> {

}
