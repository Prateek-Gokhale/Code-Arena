// FILE: src/main/java/com/library/dto/response/BookResponse.java
package com.library.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishedYear;
    private String description;
    private String coverImageUrl;
    private Integer totalCopies;
    private Integer availableCopies;
    private boolean available;
    private Set<String> categories;
    private LocalDateTime createdAt;
}
