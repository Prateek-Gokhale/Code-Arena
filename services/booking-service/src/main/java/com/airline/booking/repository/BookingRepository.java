package com.airline.booking.repository;

import com.airline.booking.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPassengerEmailIgnoreCase(String passengerEmail);
}
