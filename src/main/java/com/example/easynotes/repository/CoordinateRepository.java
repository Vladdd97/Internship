package com.example.easynotes.repository;

import com.example.easynotes.model.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by rajeevkumarsingh on 27/06/17.
 */
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {

}
