package com.airline.flight.controller;

import com.airline.flight.dto.FlightRequest;
import com.airline.flight.dto.FlightResponse;
import com.airline.flight.dto.SeatUpdateRequest;
import com.airline.flight.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public List<FlightResponse> getFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return flightService.searchFlights(origin, destination, date);
    }

    @GetMapping("/{id}")
    public FlightResponse getFlight(@PathVariable Long id) {
        return flightService.getFlight(id);
    }

    @PostMapping
    public ResponseEntity<FlightResponse> createFlight(@Valid @RequestBody FlightRequest request) {
        FlightResponse created = flightService.createFlight(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/reserve")
    public FlightResponse reserveSeats(@PathVariable Long id, @Valid @RequestBody SeatUpdateRequest request) {
        return flightService.reserveSeats(id, request.getSeats());
    }

    @PostMapping("/{id}/release")
    public FlightResponse releaseSeats(@PathVariable Long id, @Valid @RequestBody SeatUpdateRequest request) {
        return flightService.releaseSeats(id, request.getSeats());
    }
}
