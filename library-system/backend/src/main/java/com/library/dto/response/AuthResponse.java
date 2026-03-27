// FILE: src/main/java/com/library/dto/response/AuthResponse.java
package com.library.dto.response;

import com.library.entity.User;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private User.Role role;
}
