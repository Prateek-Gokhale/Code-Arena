package com.library.controller;

import com.library.dto.request.AssistantRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.AssistantResponse;
import com.library.service.impl.AssistantServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
@Tag(name = "Assistant", description = "AI-style assistant for book information")
@SecurityRequirement(name = "bearerAuth")
public class AssistantController {

    private final AssistantServiceImpl assistantService;

    @PostMapping("/book-info")
    @Operation(summary = "Ask questions about available books")
    public ResponseEntity<ApiResponse<AssistantResponse>> askBookInfo(@Valid @RequestBody AssistantRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Assistant response generated",
                assistantService.answerBookQuestion(request.getQuestion())));
    }
}
