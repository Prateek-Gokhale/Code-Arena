package com.library.controller;

import com.library.dto.request.CartItemRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.CartResponse;
import com.library.dto.response.PurchaseResponse;
import com.library.service.impl.CartServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Member cart and purchase APIs")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartServiceImpl cartService;

    @GetMapping
    @Operation(summary = "Get current member cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(authentication.getName())));
    }

    @PostMapping("/items")
    @Operation(summary = "Add a book to cart")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book added to cart", cartService.addToCart(authentication.getName(), request)));
    }

    @DeleteMapping("/items/{bookId}")
    @Operation(summary = "Remove a book from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            Authentication authentication,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(ApiResponse.success("Book removed from cart", cartService.removeFromCart(authentication.getName(), bookId)));
    }

    @PostMapping("/checkout")
    @Operation(summary = "Purchase all items currently in cart")
    public ResponseEntity<ApiResponse<PurchaseResponse>> checkout(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Purchase completed", cartService.checkout(authentication.getName())));
    }

    @GetMapping("/purchases")
    @Operation(summary = "Get purchase history for current member")
    public ResponseEntity<ApiResponse<List<PurchaseResponse>>> getMyPurchases(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getMyPurchases(authentication.getName())));
    }
}
