package com.yatharth.habittrackerbackend.DTOs;

import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Model.User;

public class HabitMapper {
    public static HabitDto toDto(Habit habit){
        User user = habit.getUser();
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getUsername(), user.getHabits());

        return new HabitDto(habit.getId(), habit.getTitle(), habit.getCategory(), habit.getType(), userDto);
    }
}
