package com.airline.flight.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SeatUpdateRequest {

    @NotNull
    @Min(1)
    private Integer seats;

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }
}
