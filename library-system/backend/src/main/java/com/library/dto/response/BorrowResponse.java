// FILE: src/main/java/com/library/dto/response/BorrowResponse.java
package com.library.dto.response;

import com.library.entity.BorrowRecord;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BorrowResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowRecord.Status status;
    private BigDecimal fine;
    private boolean finePaid;
    private String notes;
    private LocalDateTime createdAt;
    private long overdueDays;
}
