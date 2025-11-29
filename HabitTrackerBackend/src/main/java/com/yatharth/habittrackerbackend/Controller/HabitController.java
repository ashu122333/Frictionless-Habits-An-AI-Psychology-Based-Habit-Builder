package com.yatharth.habittrackerbackend.Controller;

import com.yatharth.habittrackerbackend.DTOs.HabitDto;
import com.yatharth.habittrackerbackend.DTOs.HabitPostRequest;
import com.yatharth.habittrackerbackend.Model.Habit;
import com.yatharth.habittrackerbackend.Service.HabitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/habitPost")
public class HabitController {
    private final HabitService service;

    public HabitController(HabitService service){
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<HabitDto> createHabit(@RequestBody HabitPostRequest request, Principal principal){
        String username = principal.getName();
        return service.createHabit(request, username);
    }

    @GetMapping("/get")
    public ResponseEntity<List<Habit>> getHabits(Principal principal){
        String username = principal.getName();
        return service.getHabits(username);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Integer id){
        return service.deleteHabit(id);
    }
}
