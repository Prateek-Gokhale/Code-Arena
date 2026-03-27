package com.library.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssistantRequest {
    @NotBlank(message = "Question is required")
    private String question;
}
