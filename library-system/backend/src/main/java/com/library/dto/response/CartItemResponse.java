package com.library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long bookId;
    private String title;
    private String author;
    private String coverImageUrl;
    private int quantity;
    private int availableCopies;
}
