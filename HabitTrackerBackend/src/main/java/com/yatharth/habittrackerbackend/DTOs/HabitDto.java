package com.yatharth.habittrackerbackend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class HabitDto {
    private Integer id;
    private String title;
    private String category;
    private String type;
    private UserDto user;
}
