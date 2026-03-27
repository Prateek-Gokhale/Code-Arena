// FILE: src/main/java/com/library/repository/ReservationRepository.java
package com.library.repository;

import com.library.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByUserId(Long userId, Pageable pageable);
    Page<Reservation> findByBookId(Long bookId, Pageable pageable);
    Page<Reservation> findByStatus(Reservation.Status status, Pageable pageable);

    boolean existsByBookIdAndUserIdAndStatus(Long bookId, Long userId, Reservation.Status status);

    Optional<Reservation> findFirstByBookIdAndStatusOrderByCreatedAtAsc(Long bookId, Reservation.Status status);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.book.id = :bookId AND r.status = 'PENDING'")
    long countPendingByBookId(@Param("bookId") Long bookId);

    @Query("SELECT r FROM Reservation r WHERE r.book.id = :bookId AND r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Reservation> findPendingByBookIdOrdered(@Param("bookId") Long bookId);
}
