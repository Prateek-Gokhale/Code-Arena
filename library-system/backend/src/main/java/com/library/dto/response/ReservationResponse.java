// FILE: src/main/java/com/library/dto/response/ReservationResponse.java
package com.library.dto.response;

import com.library.entity.Reservation;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private Long userId;
    private String userName;
    private Reservation.Status status;
    private LocalDate reservationDate;
    private LocalDate expiryDate;
    private Integer queuePosition;
    private String notes;
    private LocalDateTime createdAt;
}
