package com.example.easycoordinate.controller;

import com.example.easycoordinate.model.ApplicationUser;
import com.example.easycoordinate.repository.ApplicationUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/users")
public class UserController {

    private ApplicationUserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(ApplicationUserRepository userRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody ApplicationUser user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().body(user.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<ApplicationUser> login(@RequestBody String username, String password) {
        ApplicationUser u = userRepository.findByUsername(username);
        if (u == null) {
            return ResponseEntity.notFound().build();
        }
        if(u.getPassword().equals(password)){
            return ResponseEntity.ok().body(u);
        }
        return ResponseEntity.notFound().build();

    }
}
