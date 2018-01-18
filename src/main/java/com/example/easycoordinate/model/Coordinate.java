package com.example.easycoordinate.model;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;


@Entity
@Table(name = "coordinates")
public class Coordinate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank
    private String addressStart;

    @NotBlank
    private String coordinateStart;

    @NotBlank
    private String addressEnd;

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

    public String getAddressStart() {
        return addressStart;
    }

    public void setAddressStart(String addressStart) {
        this.addressStart = addressStart;
    }

    public String getAddressEnd() {
        return addressEnd;
    }

    public void setAddressEnd(String addressEnd) {
        this.addressEnd = addressEnd;
    }
}
