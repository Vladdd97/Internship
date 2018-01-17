package com.example.easycoordinate.repository;

import com.example.easycoordinate.model.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {

}
