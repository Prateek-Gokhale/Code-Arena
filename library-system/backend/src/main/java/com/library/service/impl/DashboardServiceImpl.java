// FILE: src/main/java/com/library/service/impl/DashboardServiceImpl.java
package com.library.service.impl;

import com.library.dto.response.BorrowResponse;
import com.library.dto.response.DashboardResponse;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRepository;
    private final ReservationRepository reservationRepository;
    private final BorrowServiceImpl borrowService;

    public DashboardResponse getDashboard() {
        List<Object[]> topBooksRaw = bookRepository.findTopBorrowedBooks(PageRequest.of(0, 5));
        List<DashboardResponse.TopBookResponse> topBooks = topBooksRaw.stream()
                .map(row -> {
                    var book = (com.library.entity.Book) row[0];
                    long count = (long) row[1];
                    return DashboardResponse.TopBookResponse.builder()
                            .bookId(book.getId()).title(book.getTitle())
                            .author(book.getAuthor()).borrowCount(count).build();
                }).collect(Collectors.toList());

        List<BorrowResponse> overdueList = borrowRepository
                .findOverdueRecords(LocalDate.now())
                .stream().map(borrowService::toResponse).collect(Collectors.toList());

        List<BorrowResponse> recent = borrowRepository
                .findRecentActivity(PageRequest.of(0, 10))
                .stream().map(borrowService::toResponse).collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalBooks(bookRepository.count())
                .totalMembers(userRepository.countByRole(User.Role.MEMBER))
                .activeBorrows(borrowRepository.countByStatus(BorrowRecord.Status.ACTIVE))
                .overdueBooks(overdueList.size())
                .totalReservations(reservationRepository.count())
                .availableBooks(bookRepository.countByAvailableCopiesGreaterThan(0))
                .topBorrowedBooks(topBooks)
                .recentActivity(recent)
                .overdueList(overdueList)
                .build();
    }
}
