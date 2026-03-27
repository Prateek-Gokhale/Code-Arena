package com.airline.flight.service;

import com.airline.flight.domain.Flight;
import com.airline.flight.dto.FlightRequest;
import com.airline.flight.dto.FlightResponse;
import com.airline.flight.exception.BadRequestException;
import com.airline.flight.exception.ResourceNotFoundException;
import com.airline.flight.repository.FlightRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<FlightResponse> searchFlights(String origin, String destination, LocalDate date) {
        return flightRepository.findAll(Sort.by(Sort.Direction.ASC, "departureTime"))
                .stream()
                .filter(flight -> origin == null || origin.isBlank() || flight.getOrigin().equalsIgnoreCase(origin.trim()))
                .filter(flight -> destination == null || destination.isBlank() || flight.getDestination().equalsIgnoreCase(destination.trim()))
                .filter(flight -> date == null || flight.getDepartureTime().toLocalDate().equals(date))
                .map(this::toResponse)
                .toList();
    }

    public FlightResponse getFlight(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found for id: " + flightId));
        return toResponse(flight);
    }

    @Transactional
    public FlightResponse createFlight(FlightRequest request) {
        validateTiming(request);

        Flight flight = new Flight();
        flight.setFlightNumber(request.getFlightNumber().trim().toUpperCase());
        flight.setAirline(request.getAirline().trim());
        flight.setOrigin(request.getOrigin().trim().toUpperCase());
        flight.setDestination(request.getDestination().trim().toUpperCase());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setBasePrice(request.getBasePrice());
        flight.setTotalSeats(request.getTotalSeats());
        flight.setAvailableSeats(request.getTotalSeats());

        Flight saved = flightRepository.save(flight);
        return toResponse(saved);
    }

    @Transactional
    public FlightResponse reserveSeats(Long flightId, int seats) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found for id: " + flightId));
        flight.reserveSeats(seats);
        return toResponse(flightRepository.save(flight));
    }

    @Transactional
    public FlightResponse releaseSeats(Long flightId, int seats) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found for id: " + flightId));
        flight.releaseSeats(seats);
        return toResponse(flightRepository.save(flight));
    }

    private FlightResponse toResponse(Flight flight) {
        FlightResponse response = new FlightResponse();
        response.setId(flight.getId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setAirline(flight.getAirline());
        response.setOrigin(flight.getOrigin());
        response.setDestination(flight.getDestination());
        response.setDepartureTime(flight.getDepartureTime());
        response.setArrivalTime(flight.getArrivalTime());
        response.setBasePrice(flight.getBasePrice());
        response.setTotalSeats(flight.getTotalSeats());
        response.setAvailableSeats(flight.getAvailableSeats());
        return response;
    }

    private void validateTiming(FlightRequest request) {
        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new BadRequestException("Arrival time must be after departure time");
        }
    }
}
