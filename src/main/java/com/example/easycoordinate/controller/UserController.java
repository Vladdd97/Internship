package com.example.easycoordinate.controller;

import com.example.easycoordinate.model.ApplicationUser;
import com.example.easycoordinate.model.Coordinate;
import com.example.easycoordinate.repository.ApplicationUserRepository;
import com.example.easycoordinate.repository.CoordinateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/users")
public class UserController {

    private ApplicationUserRepository userRepository;
    private CoordinateRepository coordinateRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(ApplicationUserRepository userRepository,
                          CoordinateRepository coordinateRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.coordinateRepository = coordinateRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody ApplicationUser user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().body(user.getUsername());
    }

    @PostMapping("/phoneNumber")
    public ResponseEntity<String> getUserDetails(@RequestBody Map<String, String> coordinateId) {
        Coordinate coordinate = coordinateRepository.findOne(Long.parseLong(coordinateId.get("coordinateId")));
        ApplicationUser user = userRepository.getApplicationUserById(coordinate.getApplicationUser().getId());
        return ResponseEntity.ok().body(user.getPhone());
    }

//    @PostMapping("/login")
//    public ResponseEntity<ApplicationUser> login(@RequestBody String username, String password) {
//        ApplicationUser u = userRepository.findByUsername(username);
//        if (u == null) {
//            return ResponseEntity.notFound().build();
//        }
//        if(u.getPassword().equals(password)){
//            return ResponseEntity.ok().body(u);
//        }
//        return ResponseEntity.notFound().build();
//
//    }
}
