package com.example.easycoordinate.controller;

import com.example.easycoordinate.model.Coordinate;
import com.example.easycoordinate.repository.CoordinateRepository;
import com.example.easycoordinate.service.CoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
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
        if (coordinate == null) {
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
        if (coordinate == null) {
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
        if (coordinate == null) {
            return ResponseEntity.notFound().build();
        }

        coordinateRepository.delete(coordinate);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/availableRoute")
    public List<Coordinate> getAvailableRoute() {
        return CoordinateService.getAvailableRoute(coordinateRepository.findAll());
    }

    @GetMapping("/sameRoute/{index}")
    public List<Coordinate> getSameRoute(@PathVariable(value = "index") Long coordIndex) {
        return CoordinateService.getSameRoute(
                coordinateRepository.findOne(coordIndex),
                coordinateRepository.findAll());
    }
}
