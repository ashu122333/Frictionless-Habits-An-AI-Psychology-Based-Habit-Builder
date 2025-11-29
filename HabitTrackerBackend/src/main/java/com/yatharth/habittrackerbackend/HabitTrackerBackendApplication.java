package com.yatharth.habittrackerbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HabitTrackerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HabitTrackerBackendApplication.class, args);
    }

}
