// FILE: src/main/java/com/library/repository/BorrowRecordRepository.java
package com.library.repository;

import com.library.entity.BorrowRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    Page<BorrowRecord> findByUserId(Long userId, Pageable pageable);
    Page<BorrowRecord> findByBookId(Long bookId, Pageable pageable);
    Page<BorrowRecord> findByStatus(BorrowRecord.Status status, Pageable pageable);

    Optional<BorrowRecord> findByBookIdAndUserIdAndStatus(Long bookId, Long userId, BorrowRecord.Status status);

    @Query("SELECT br FROM BorrowRecord br WHERE br.status = 'ACTIVE' AND br.dueDate < :today")
    List<BorrowRecord> findOverdueRecords(@Param("today") LocalDate today);

    @Query("SELECT br FROM BorrowRecord br WHERE br.status = 'ACTIVE' AND br.dueDate < :today")
    Page<BorrowRecord> findOverdueRecords(@Param("today") LocalDate today, Pageable pageable);

    long countByStatus(BorrowRecord.Status status);

    boolean existsByBookIdAndUserIdAndStatus(Long bookId, Long userId, BorrowRecord.Status status);

    @Query("SELECT br FROM BorrowRecord br ORDER BY br.createdAt DESC")
    Page<BorrowRecord> findRecentActivity(Pageable pageable);
}
