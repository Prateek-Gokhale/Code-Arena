// FILE: src/main/java/com/library/dto/response/DashboardResponse.java
package com.library.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private long totalBooks;
    private long totalMembers;
    private long activeBorrows;
    private long overdueBooks;
    private long totalReservations;
    private long availableBooks;
    private List<TopBookResponse> topBorrowedBooks;
    private List<BorrowResponse> recentActivity;
    private List<BorrowResponse> overdueList;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopBookResponse {
        private Long bookId;
        private String title;
        private String author;
        private long borrowCount;
    }
}
