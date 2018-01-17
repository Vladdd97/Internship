package com.example.easynotes.model;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;

/**
 * Created by rajeevkumarsingh on 27/06/17.
 */
@Entity
@Table(name = "coordinates")
public class Coordinate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank
    private String coordinateStart;

    @NotBlank
    private String coordinateEnd;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCoordinateStart() {
        return coordinateStart;
    }

    public void setCoordinateStart(String coordinateStart) {
        this.coordinateStart = coordinateStart;
    }

    public String getCoordinateEnd() {
        return coordinateEnd;
    }

    public void setCoordinateEnd(String coordinateEnd) {
        this.coordinateEnd = coordinateEnd;
    }

}
