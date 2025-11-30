package com.yatharth.habittrackerbackend.DTOs;

import com.yatharth.habittrackerbackend.Model.HabitLog;
import com.yatharth.habittrackerbackend.Model.HabitStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class HabitLogDto {
    private LocalDate date;        // yyyy-MM-dd
    private HabitStatus status;    // COMPLETED, SKIPPED, PENDING, etc.

    public static HabitLogDto from(HabitLog log) {
        return HabitLogDto.builder()
                .date(log.getDate())
                .status(log.getStatus())
                .build();
    }
}
