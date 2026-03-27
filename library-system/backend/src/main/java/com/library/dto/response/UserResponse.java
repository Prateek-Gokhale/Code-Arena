// FILE: src/main/java/com/library/dto/response/UserResponse.java
package com.library.dto.response;

import com.library.entity.User;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private User.Role role;
    private boolean active;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
}
