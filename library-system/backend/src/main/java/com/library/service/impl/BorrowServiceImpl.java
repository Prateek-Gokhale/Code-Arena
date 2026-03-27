// FILE: src/main/java/com/library/service/impl/BorrowServiceImpl.java
package com.library.service.impl;

import com.library.dto.request.BorrowRequest;
import com.library.dto.response.BorrowResponse;
import com.library.entity.*;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class BorrowServiceImpl {

    private final BorrowRecordRepository borrowRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Value("${app.fine.per-day}")
    private double finePerDay;

    @Value("${app.fine.loan-days}")
    private int loanDays;

    public BorrowResponse issueBook(BorrowRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", request.getBookId()));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));

        if (!book.isAvailable()) {
            throw new BadRequestException("Book '" + book.getTitle() + "' is not available");
        }
        if (borrowRepository.existsByBookIdAndUserIdAndStatus(book.getId(), user.getId(), BorrowRecord.Status.ACTIVE)) {
            throw new BadRequestException("User already has this book borrowed");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate today = LocalDate.now();
        BorrowRecord record = BorrowRecord.builder()
                .book(book)
                .user(user)
                .issueDate(today)
                .dueDate(today.plusDays(loanDays))
                .status(BorrowRecord.Status.ACTIVE)
                .notes(request.getNotes())
                .build();

        return toResponse(borrowRepository.save(record));
    }

    public BorrowResponse returnBook(Long borrowId) {
        BorrowRecord record = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record", borrowId));

        if (record.getStatus() == BorrowRecord.Status.RETURNED) {
            throw new BadRequestException("Book already returned");
        }

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);
        record.setStatus(BorrowRecord.Status.RETURNED);

        if (today.isAfter(record.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), today);
            record.setFine(BigDecimal.valueOf(overdueDays * finePerDay));
        }

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return toResponse(borrowRepository.save(record));
    }

    public void updateOverdueStatuses() {
        LocalDate today = LocalDate.now();
        borrowRepository.findOverdueRecords(today).forEach(record -> {
            record.setStatus(BorrowRecord.Status.OVERDUE);
            long days = ChronoUnit.DAYS.between(record.getDueDate(), today);
            record.setFine(BigDecimal.valueOf(days * finePerDay));
            borrowRepository.save(record);
        });
    }

    public Page<BorrowResponse> getAllBorrows(Pageable pageable) {
        return borrowRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<BorrowResponse> getBorrowsByUser(Long userId, Pageable pageable) {
        return borrowRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    public Page<BorrowResponse> getOverdueBooks(Pageable pageable) {
        return borrowRepository.findOverdueRecords(LocalDate.now(), pageable).map(this::toResponse);
    }

    public BorrowResponse toResponse(BorrowRecord r) {
        long overdueDays = 0;
        if (r.getStatus() == BorrowRecord.Status.ACTIVE && LocalDate.now().isAfter(r.getDueDate())) {
            overdueDays = ChronoUnit.DAYS.between(r.getDueDate(), LocalDate.now());
        }
        return BorrowResponse.builder()
                .id(r.getId())
                .bookId(r.getBook().getId())
                .bookTitle(r.getBook().getTitle())
                .bookIsbn(r.getBook().getIsbn())
                .userId(r.getUser().getId())
                .userName(r.getUser().getName())
                .userEmail(r.getUser().getEmail())
                .issueDate(r.getIssueDate())
                .dueDate(r.getDueDate())
                .returnDate(r.getReturnDate())
                .status(r.getStatus())
                .fine(r.getFine())
                .finePaid(r.isFinePaid())
                .notes(r.getNotes())
                .createdAt(r.getCreatedAt())
                .overdueDays(overdueDays)
                .build();
    }
}
