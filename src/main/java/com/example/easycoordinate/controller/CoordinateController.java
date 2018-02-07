package com.example.easycoordinate.controller;

import com.example.easycoordinate.model.ApplicationUser;
import com.example.easycoordinate.model.Coordinate;
import com.example.easycoordinate.repository.ApplicationUserRepository;
import com.example.easycoordinate.repository.CoordinateRepository;
import com.example.easycoordinate.service.CoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/users/{applicationUserId}")
public class CoordinateController {

    private Logger log = Logger.getLogger(CoordinateController.class.getName());

    @Autowired
    CoordinateRepository coordinateRepository;

    @Autowired
    ApplicationUserRepository applicationUserRepository;

    @GetMapping(value = "/coordinates")
    public List<Coordinate> getAllCoordinates(@PathVariable(value = "applicationUserId") Long applicationUserId) {
        return coordinateRepository.findAllByApplicationUserId(applicationUserId);
    }

    @GetMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> getCoordinateById(
            @PathVariable(value = "applicationUserId") Long applicationUserId,
            @PathVariable(value = "id") Long coordId) {
        List<Coordinate> coordinates = coordinateRepository.findAllByApplicationUserId(applicationUserId);

        Coordinate coordinate = coordinates
                .stream()
                .filter(c -> c.getId().equals(coordId))
                .findFirst()
                .orElse(null);

        if (coordinate == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(coordinate);
    }

    @PostMapping("/coordinates")
    public ResponseEntity<Coordinate> createCoordinate(@PathVariable(value = "applicationUserId") Long applicationUserId,
                                                       @Valid @RequestBody Coordinate coordinate) {

        ApplicationUser user = applicationUserRepository.getApplicationUserById(applicationUserId);
        if (user != null && user.getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal())) {
            coordinate.setApplicationUser(applicationUserRepository.getApplicationUserById(applicationUserId));
            coordinateRepository.save(coordinate);
            return ResponseEntity.ok().body(coordinate);
        }

        log.info("No coordinate was added!");
        return ResponseEntity.badRequest().build();

    }


    @PutMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> updateCoordinate(@PathVariable(value = "applicationUserId") Long aui,
                                                       @PathVariable(value = "id") Long coordId,
                                                       @Valid @RequestBody Coordinate coordinateDetails) {

        Coordinate coordinate = coordinateRepository.findOne(coordId);
        if (coordinate == null) {
            return ResponseEntity.notFound().build();
        }

        ApplicationUser user = applicationUserRepository.getApplicationUserById(aui);
        if (user != null && user.getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal())) {
            coordinate.setAddressStart(coordinateDetails.getAddressStart());
            coordinate.setAddressEnd(coordinateDetails.getAddressEnd());
            coordinate.setCoordinateStart(coordinateDetails.getCoordinateStart());
            coordinate.setCoordinateEnd(coordinateDetails.getCoordinateEnd());
            Coordinate updatedCoordinate = coordinateRepository.save(coordinate);
            return ResponseEntity.ok(updatedCoordinate);
        }
        log.info("No coordinate was modified");
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> deleteCoordinate(@PathVariable(value = "applicationUserId") Long aui,
                                                       @PathVariable(value = "id") Long coordId) {

        Coordinate coordinate = coordinateRepository.findOne(coordId);
        if (coordinate == null) {
            return ResponseEntity.notFound().build();
        }
        ApplicationUser user = applicationUserRepository.getApplicationUserById(aui);
        if (user != null && user.getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal())) {
            coordinateRepository.delete(coordinate);
            return ResponseEntity.ok().build();
        }
        log.info("No coordinate was deleted!");
        return ResponseEntity.badRequest().build();

    }

    // path to get all the available routes
    @GetMapping("/availableAllRoutes")
    public List<Coordinate> getAvailableRoutes() {
        return CoordinateService.getAvailableRoutes(coordinateRepository.findAll());
    }

    // path to get personal routes, specific for an user
    @GetMapping("/availablePersonalRoutes")
    public List<Coordinate> getAvailableRoutesByUID(@PathVariable(value = "applicationUserId") Long aui) {
        return CoordinateService.getAvailableRoutes(coordinateRepository.findAllByApplicationUserId(aui));
    }

    @GetMapping("/sameRoutes/{index}")
    public List<Coordinate> getSameRoutes(@PathVariable(value = "index") Long coordIndex) {
        return CoordinateService.getSameRoute(
                coordinateRepository.findOne(coordIndex),
                coordinateRepository.findAll());
    }

    @PostMapping("/request")
    public List<Coordinate> getRoutesWithCloseCoordinates(@RequestBody Map<String, String> coordinatesString) {
        return CoordinateService.getSameRouteWithoutStoringObject
                ( coordinatesString.get("startCoordinate"), coordinatesString.get("endCoordinate"), coordinateRepository.findAll());

    }

}
