// FILE: src/main/java/com/library/controller/DashboardController.java
package com.library.controller;

import com.library.dto.response.ApiResponse;
import com.library.dto.response.DashboardResponse;
import com.library.service.impl.DashboardServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Statistics and reports")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardServiceImpl dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard()));
    }
}
