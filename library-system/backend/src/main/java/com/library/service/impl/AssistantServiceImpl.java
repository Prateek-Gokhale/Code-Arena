package com.library.service.impl;

import com.library.dto.response.AssistantResponse;
import com.library.entity.Book;
import com.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssistantServiceImpl {

    private final BookRepository bookRepository;

    public AssistantResponse answerBookQuestion(String question) {
        String cleanedQuestion = question == null ? "" : question.trim();
        List<Book> books = bookRepository.findAll();
        List<Book> ranked = rankBooks(cleanedQuestion, books);
        List<Book> top = ranked.stream().limit(3).collect(Collectors.toList());

        String answer = buildAnswer(cleanedQuestion, top, books.size());

        return AssistantResponse.builder()
                .question(cleanedQuestion)
                .answer(answer)
                .suggestions(top.stream().map(this::toHint).collect(Collectors.toList()))
                .build();
    }

    private List<Book> rankBooks(String question, List<Book> books) {
        Set<String> keywords = Arrays.stream(question.toLowerCase().split("[^a-z0-9]+"))
                .filter(k -> k.length() > 2)
                .collect(Collectors.toSet());

        return books.stream()
                .sorted((a, b) -> Integer.compare(score(b, keywords), score(a, keywords)))
                .collect(Collectors.toList());
    }

    private int score(Book book, Set<String> keywords) {
        if (keywords.isEmpty()) return 0;
        String title = safe(book.getTitle());
        String author = safe(book.getAuthor());
        String desc = safe(book.getDescription());

        int score = 0;
        for (String k : keywords) {
            if (title.contains(k)) score += 4;
            if (author.contains(k)) score += 3;
            if (desc.contains(k)) score += 1;
        }
        if (book.getAvailableCopies() > 0) score += 1;
        return score;
    }

    private String buildAnswer(String question, List<Book> top, int totalBooks) {
        if (top.isEmpty()) {
            return "I could not find a direct match. Try asking by title, author, or genre. " +
                    "There are " + totalBooks + " books in the catalog.";
        }

        String q = question.toLowerCase();
        if (q.contains("recommend")) {
            Book rec = top.stream().filter(b -> b.getAvailableCopies() > 0).findFirst().orElse(top.get(0));
            return "I recommend \"" + rec.getTitle() + "\" by " + rec.getAuthor() +
                    ". It currently has " + rec.getAvailableCopies() + " copy/copies available.";
        }

        if (q.contains("available") || q.contains("stock")) {
            return top.stream()
                    .map(b -> "\"" + b.getTitle() + "\" has " + b.getAvailableCopies() + " copy/copies available")
                    .collect(Collectors.joining(". ")) + ".";
        }

        return "Here are some relevant books: " +
                top.stream()
                        .map(b -> "\"" + b.getTitle() + "\" by " + b.getAuthor())
                        .collect(Collectors.joining(", ")) +
                ". Ask me about availability, recommendations, or a specific title.";
    }

    private AssistantResponse.BookHint toHint(Book b) {
        String shortDescription = b.getDescription();
        if (StringUtils.hasText(shortDescription) && shortDescription.length() > 140) {
            shortDescription = shortDescription.substring(0, 140) + "...";
        }
        return AssistantResponse.BookHint.builder()
                .id(b.getId())
                .title(b.getTitle())
                .author(b.getAuthor())
                .availableCopies(b.getAvailableCopies())
                .description(shortDescription)
                .build();
    }

    private String safe(String value) {
        return value == null ? "" : value.toLowerCase();
    }
}
