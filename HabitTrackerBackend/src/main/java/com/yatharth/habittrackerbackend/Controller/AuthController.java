package com.yatharth.habittrackerbackend.Controller;

import com.yatharth.habittrackerbackend.DTOs.AuthResponse;
import com.yatharth.habittrackerbackend.DTOs.LoginRequest;
import com.yatharth.habittrackerbackend.DTOs.RegisterRequest;
import com.yatharth.habittrackerbackend.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {
    private AuthService service;

    public AuthController(AuthService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<String> userRegister(@RequestBody RegisterRequest request){
        return service.addUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request){
        String token =service.loginUser(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
