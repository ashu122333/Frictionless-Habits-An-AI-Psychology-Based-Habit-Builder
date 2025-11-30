package com.yatharth.habittrackerbackend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class HabitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private HabitStatus status;

    @ManyToOne
    @JoinColumn(name = "habit_id")
    private Habit habit;
}
