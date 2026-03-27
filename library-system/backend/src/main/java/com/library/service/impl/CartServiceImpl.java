package com.library.service.impl;

import com.library.dto.request.CartItemRequest;
import com.library.dto.response.CartItemResponse;
import com.library.dto.response.CartResponse;
import com.library.dto.response.PurchaseItemResponse;
import com.library.dto.response.PurchaseResponse;
import com.library.entity.*;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;

    public CartResponse getCart(String email) {
        User user = getMember(email);
        List<CartItemResponse> items = cartItemRepository.findByUserId(user.getId())
                .stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());

        int totalItems = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
        return CartResponse.builder()
                .items(items)
                .totalItems(totalItems)
                .build();
    }

    public CartResponse addToCart(String email, CartItemRequest request) {
        User user = getMember(email);
        Book book = findBook(request.getBookId());

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book '" + book.getTitle() + "' is currently unavailable");
        }

        CartItem item = cartItemRepository.findByUserIdAndBookId(user.getId(), book.getId())
                .orElse(CartItem.builder().user(user).book(book).quantity(0).build());

        int nextQty = item.getQuantity() + request.getQuantity();
        if (nextQty > book.getAvailableCopies()) {
            throw new BadRequestException("Only " + book.getAvailableCopies() + " copy/copies available for '" + book.getTitle() + "'");
        }

        item.setQuantity(nextQty);
        cartItemRepository.save(item);
        return getCart(email);
    }

    public CartResponse removeFromCart(String email, Long bookId) {
        User user = getMember(email);
        cartItemRepository.deleteByUserIdAndBookId(user.getId(), bookId);
        return getCart(email);
    }

    public PurchaseResponse checkout(String email) {
        User user = getMember(email);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        int totalItems = cartItems.stream().mapToInt(CartItem::getQuantity).sum();
        Purchase purchase = purchaseRepository.save(Purchase.builder()
                .user(user)
                .totalItems(totalItems)
                .build());

        List<PurchaseItem> purchaseItems = cartItems.stream().map(item -> {
            Book book = findBook(item.getBook().getId());

            if (item.getQuantity() > book.getAvailableCopies()) {
                throw new BadRequestException("Not enough available copies for '" + book.getTitle() + "'");
            }

            int remainingAvailable = book.getAvailableCopies() - item.getQuantity();
            int remainingTotal = book.getTotalCopies() - item.getQuantity();
            if (remainingTotal < 0) {
                throw new BadRequestException("Inventory mismatch for '" + book.getTitle() + "'");
            }

            book.setAvailableCopies(remainingAvailable);
            book.setTotalCopies(remainingTotal);
            bookRepository.save(book);

            return PurchaseItem.builder()
                    .purchase(purchase)
                    .book(book)
                    .quantity(item.getQuantity())
                    .build();
        }).collect(Collectors.toList());

        purchaseItemRepository.saveAll(purchaseItems);
        cartItemRepository.deleteByUserId(user.getId());

        purchase.setItems(purchaseItems);
        return toPurchaseResponse(purchase);
    }

    public List<PurchaseResponse> getMyPurchases(String email) {
        User user = getMember(email);
        return purchaseRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toPurchaseResponse)
                .collect(Collectors.toList());
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        Book book = item.getBook();
        return CartItemResponse.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .coverImageUrl(book.getCoverImageUrl())
                .quantity(item.getQuantity())
                .availableCopies(book.getAvailableCopies())
                .build();
    }

    private PurchaseResponse toPurchaseResponse(Purchase purchase) {
        List<PurchaseItemResponse> items = purchase.getItems().stream().map(i ->
                PurchaseItemResponse.builder()
                        .bookId(i.getBook().getId())
                        .title(i.getBook().getTitle())
                        .author(i.getBook().getAuthor())
                        .quantity(i.getQuantity())
                        .build()
        ).collect(Collectors.toList());

        return PurchaseResponse.builder()
                .id(purchase.getId())
                .totalItems(purchase.getTotalItems())
                .purchasedAt(purchase.getCreatedAt())
                .items(items)
                .build();
    }

    private User getMember(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email " + email));

        if (!user.isActive()) {
            throw new BadRequestException("Account is inactive");
        }
        if (user.getRole() != User.Role.MEMBER) {
            throw new BadRequestException("Only members can purchase books");
        }
        return user;
    }

    private Book findBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
    }
}
