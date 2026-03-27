// FILE: src/main/java/com/library/dto/request/BookRequest.java
package com.library.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class BookRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 150)
    private String author;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20)
    private String isbn;

    @Size(max = 150)
    private String publisher;

    @Min(1000) @Max(2100)
    private Integer publishedYear;

    @Size(max = 1000)
    private String description;

    private String coverImageUrl;

    @Min(1)
    @NotNull(message = "Total copies is required")
    private Integer totalCopies;

    private Set<Long> categoryIds;
}
