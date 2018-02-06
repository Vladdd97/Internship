package com.example.easycoordinate.repository;

import com.example.easycoordinate.model.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {
    List<Coordinate> findAllByApplicationUserId(Long ApplicationUserId);
    List<Coordinate> findAllByApplicationUserAndForDriverIsTrue(Long ApplicationUserId);
}
