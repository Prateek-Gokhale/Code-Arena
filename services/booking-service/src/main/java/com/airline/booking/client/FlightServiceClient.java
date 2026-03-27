package com.airline.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "flight-service", path = "/api/flights")
public interface FlightServiceClient {

    @GetMapping("/{flightId}")
    FlightClientResponse getFlight(@PathVariable("flightId") Long flightId);

    @PostMapping("/{flightId}/reserve")
    FlightClientResponse reserveSeats(@PathVariable("flightId") Long flightId, @RequestBody SeatUpdateRequest request);

    @PostMapping("/{flightId}/release")
    FlightClientResponse releaseSeats(@PathVariable("flightId") Long flightId, @RequestBody SeatUpdateRequest request);
}
