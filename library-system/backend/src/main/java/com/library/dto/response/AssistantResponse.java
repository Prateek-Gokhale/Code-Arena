package com.library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantResponse {
    private String question;
    private String answer;
    private List<BookHint> suggestions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookHint {
        private Long id;
        private String title;
        private String author;
        private int availableCopies;
        private String description;
    }
}
