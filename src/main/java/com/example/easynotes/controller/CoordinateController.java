package com.example.easynotes.controller;

import com.example.easynotes.model.Coordinate;
import com.example.easynotes.repository.CoordinateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by rajeevkumarsingh on 27/06/17.
 */
@RestController
@RequestMapping("/")
public class CoordinateController {

    @Autowired
    CoordinateRepository coordinateRepository;

    @GetMapping("/coordinates")
    public List<Coordinate> getAllNotes() {
        return coordinateRepository.findAll();
    }

    @GetMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> getNoteById(@PathVariable(value = "id") Long coordId) {
        Coordinate coordinate = coordinateRepository.findOne(coordId);
        if(coordinate == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(coordinate);
    }

    @PostMapping("/coordinates")
    public Coordinate createNote(@Valid @RequestBody Coordinate coordinate) {
        return coordinateRepository.save(coordinate);
    }

    @PutMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> updateNote(@PathVariable(value = "id") Long coordId,
                                                 @Valid @RequestBody Coordinate coordinateDetails) {
        Coordinate coordinate = coordinateRepository.findOne(coordId);
        if(coordinate == null) {
            return ResponseEntity.notFound().build();
        }
        coordinate.setCoordinateStart(coordinateDetails.getCoordinateStart());
        coordinate.setCoordinateEnd(coordinateDetails.getCoordinateEnd());

        Coordinate updatedCoordinate = coordinateRepository.save(coordinate);
        return ResponseEntity.ok(updatedCoordinate);
    }

    @DeleteMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> deleteNote(@PathVariable(value = "id") Long coordId) {
        Coordinate coordinate = coordinateRepository.findOne(coordId);
        if(coordinate == null) {
            return ResponseEntity.notFound().build();
        }

        coordinateRepository.delete(coordinate);
        return ResponseEntity.ok().build();
    }
}
