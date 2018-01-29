package com.example.easycoordinate.repository;

import com.example.easycoordinate.model.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    ApplicationUser findByUsername(String username);
    ApplicationUser getApplicationUserById(Long id);
}
