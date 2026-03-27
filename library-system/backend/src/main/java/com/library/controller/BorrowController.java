// FILE: src/main/java/com/library/controller/BorrowController.java
package com.library.controller;

import com.library.dto.request.BorrowRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.BorrowResponse;
import com.library.service.impl.BorrowServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/borrows")
@RequiredArgsConstructor
@Tag(name = "Borrows", description = "Book borrow and return APIs")
@SecurityRequirement(name = "bearerAuth")
public class BorrowController {

    private final BorrowServiceImpl borrowService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Get all borrow records")
    public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getAllBorrows(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getAllBorrows(pageable)));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Get all overdue books")
    public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getOverdue(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getOverdueBooks(pageable)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Get borrow history for a specific user")
    public ResponseEntity<ApiResponse<Page<BorrowResponse>>> getUserBorrows(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getBorrowsByUser(userId, pageable)));
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Issue a book to a member")
    public ResponseEntity<ApiResponse<BorrowResponse>> issueBook(@Valid @RequestBody BorrowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book issued successfully", borrowService.issueBook(request)));
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Return a borrowed book")
    public ResponseEntity<ApiResponse<BorrowResponse>> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Book returned successfully", borrowService.returnBook(id)));
    }

    @PostMapping("/update-overdue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update overdue statuses and recalculate fines")
    public ResponseEntity<ApiResponse<Void>> updateOverdue() {
        borrowService.updateOverdueStatuses();
        return ResponseEntity.ok(ApiResponse.success("Overdue statuses updated", null));
    }
}
