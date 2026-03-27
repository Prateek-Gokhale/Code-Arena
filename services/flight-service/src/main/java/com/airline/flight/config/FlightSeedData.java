package com.airline.flight.config;

import com.airline.flight.domain.Flight;
import com.airline.flight.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class FlightSeedData {

    @Bean
    CommandLineRunner loadFlights(FlightRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.save(createFlight("AI101", "Air India", "DEL", "BOM", 2, 2, new BigDecimal("7200.00"), 180));
            repository.save(createFlight("6E502", "IndiGo", "BOM", "BLR", 3, 5, new BigDecimal("5400.00"), 186));
            repository.save(createFlight("UK221", "Vistara", "DEL", "BLR", 1, 3, new BigDecimal("6800.00"), 170));
            repository.save(createFlight("SG872", "SpiceJet", "BLR", "HYD", 4, 5, new BigDecimal("3100.00"), 174));
        };
    }

    private Flight createFlight(
            String number,
            String airline,
            String origin,
            String destination,
            int depOffsetDays,
            int arrOffsetDays,
            BigDecimal price,
            int seats) {
        Flight flight = new Flight();
        flight.setFlightNumber(number);
        flight.setAirline(airline);
        flight.setOrigin(origin);
        flight.setDestination(destination);
        flight.setDepartureTime(LocalDateTime.now().plusDays(depOffsetDays).withHour(10).withMinute(0).withSecond(0).withNano(0));
        flight.setArrivalTime(LocalDateTime.now().plusDays(arrOffsetDays).withHour(13).withMinute(15).withSecond(0).withNano(0));
        flight.setBasePrice(price);
        flight.setTotalSeats(seats);
        flight.setAvailableSeats(seats);
        return flight;
    }
}
