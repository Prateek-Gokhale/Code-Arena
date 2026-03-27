// FILE: src/main/java/com/library/dto/request/UserRequest.java
package com.library.dto.request;

import com.library.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String password;

    @NotBlank @Size(max = 100)
    private String name;

    @NotNull
    private User.Role role;

    private String phone;
    private String address;
}
