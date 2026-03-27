package com.airline.booking.client;

public class SeatUpdateRequest {

    private Integer seats;

    public SeatUpdateRequest() {
    }

    public SeatUpdateRequest(Integer seats) {
        this.seats = seats;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }
}
