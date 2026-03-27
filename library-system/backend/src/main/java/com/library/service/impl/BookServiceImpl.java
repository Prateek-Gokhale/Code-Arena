// FILE: src/main/java/com/library/service/impl/BookServiceImpl.java
package com.library.service.impl;

import com.library.dto.request.BookRequest;
import com.library.dto.response.BookResponse;
import com.library.entity.Book;
import com.library.entity.Category;
import com.library.exception.BadRequestException;
import com.library.exception.ConflictException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImpl {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Page<BookResponse> getAllBooks(String search, Pageable pageable) {
        Page<Book> books = StringUtils.hasText(search)
                ? bookRepository.search(search, pageable)
                : bookRepository.findAll(pageable);
        return books.map(this::toResponse);
    }

    public BookResponse getBookById(Long id) {
        return toResponse(findBook(id));
    }

    public BookResponse createBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new ConflictException("Book with ISBN " + request.getIsbn() + " already exists");
        }
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .publisher(request.getPublisher())
                .publishedYear(request.getPublishedYear())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies())
                .categories(resolveCategories(request.getCategoryIds()))
                .build();
        return toResponse(bookRepository.save(book));
    }

    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = findBook(id);
        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new ConflictException("Book with ISBN " + request.getIsbn() + " already exists");
        }
        int diff = request.getTotalCopies() - book.getTotalCopies();
        int newAvailable = book.getAvailableCopies() + diff;
        if (newAvailable < 0) {
            throw new BadRequestException("Cannot reduce total copies below currently borrowed count");
        }
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setPublisher(request.getPublisher());
        book.setPublishedYear(request.getPublishedYear());
        book.setDescription(request.getDescription());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(newAvailable);
        book.setCategories(resolveCategories(request.getCategoryIds()));
        return toResponse(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        Book book = findBook(id);
        if (book.getTotalCopies() != book.getAvailableCopies()) {
            throw new BadRequestException("Cannot delete book with active borrows");
        }
        bookRepository.delete(book);
    }

    private Book findBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
    }

    private Set<Category> resolveCategories(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return ids.stream()
                .map(catId -> categoryRepository.findById(catId)
                        .orElseThrow(() -> new ResourceNotFoundException("Category", catId)))
                .collect(Collectors.toSet());
    }

    public BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .publishedYear(book.getPublishedYear())
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .available(book.isAvailable())
                .categories(book.getCategories().stream().map(Category::getName).collect(Collectors.toSet()))
                .createdAt(book.getCreatedAt())
                .build();
    }
}
