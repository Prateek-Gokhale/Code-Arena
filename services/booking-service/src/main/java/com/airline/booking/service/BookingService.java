package com.airline.booking.service;

import com.airline.booking.client.FlightClientResponse;
import com.airline.booking.client.FlightServiceClient;
import com.airline.booking.client.SeatUpdateRequest;
import com.airline.booking.domain.Booking;
import com.airline.booking.domain.BookingStatus;
import com.airline.booking.dto.BookingRequest;
import com.airline.booking.dto.BookingResponse;
import com.airline.booking.exception.BadRequestException;
import com.airline.booking.exception.ResourceNotFoundException;
import com.airline.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightServiceClient flightServiceClient;

    public BookingService(BookingRepository bookingRepository, FlightServiceClient flightServiceClient) {
        this.bookingRepository = bookingRepository;
        this.flightServiceClient = flightServiceClient;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        FlightClientResponse reservedFlight = flightServiceClient.reserveSeats(
                request.getFlightId(),
                new SeatUpdateRequest(request.getSeats())
        );

        Booking booking = new Booking();
        booking.setBookingReference(generateReference());
        booking.setFlightId(request.getFlightId());
        booking.setPassengerName(request.getPassengerName().trim());
        booking.setPassengerEmail(request.getPassengerEmail().trim().toLowerCase(Locale.ROOT));
        booking.setPassengerPhone(request.getPassengerPhone().trim());
        booking.setSeatsBooked(request.getSeats());
        booking.setTotalAmount(calculateAmount(reservedFlight.getBasePrice(), request.getSeats()));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());

        try {
            Booking saved = bookingRepository.save(booking);
            return toResponse(saved, reservedFlight);
        } catch (RuntimeException ex) {
            flightServiceClient.releaseSeats(request.getFlightId(), new SeatUpdateRequest(request.getSeats()));
            throw ex;
        }
    }

    public BookingResponse getBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for id: " + bookingId));

        FlightClientResponse flight = flightServiceClient.getFlight(booking.getFlightId());
        return toResponse(booking, flight);
    }

    public List<BookingResponse> listBookings(String passengerEmail) {
        List<Booking> bookings = (passengerEmail == null || passengerEmail.isBlank())
                ? bookingRepository.findAll()
                : bookingRepository.findByPassengerEmailIgnoreCase(passengerEmail.trim());

        return bookings.stream()
                .map(booking -> {
                    FlightClientResponse flight = flightServiceClient.getFlight(booking.getFlightId());
                    return toResponse(booking, flight);
                })
                .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        FlightClientResponse releasedFlight = flightServiceClient.releaseSeats(
                saved.getFlightId(),
                new SeatUpdateRequest(saved.getSeatsBooked())
        );
        return toResponse(saved, releasedFlight);
    }

    private BookingResponse toResponse(Booking booking, FlightClientResponse flight) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingReference(booking.getBookingReference());
        response.setFlightId(booking.getFlightId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setOrigin(flight.getOrigin());
        response.setDestination(flight.getDestination());
        response.setDepartureTime(flight.getDepartureTime());
        response.setPassengerName(booking.getPassengerName());
        response.setPassengerEmail(booking.getPassengerEmail());
        response.setPassengerPhone(booking.getPassengerPhone());
        response.setSeatsBooked(booking.getSeatsBooked());
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());
        response.setBookedAt(booking.getBookedAt());
        return response;
    }

    private BigDecimal calculateAmount(BigDecimal basePrice, int seats) {
        return basePrice.multiply(BigDecimal.valueOf(seats));
    }

    private String generateReference() {
        return "PNR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
