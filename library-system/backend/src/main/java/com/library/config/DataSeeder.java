// FILE: src/main/java/com/library/config/DataSeeder.java
package com.library.config;

import com.library.entity.*;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRecordRepository borrowRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        log.info("Seeding database...");

        // ── Users ───────────────────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .email("admin@library.com").name("Admin User")
                .password(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN).active(true).phone("9000000001").build());

        User librarian = userRepository.save(User.builder()
                .email("librarian@library.com").name("Priya Sharma")
                .password(passwordEncoder.encode("Lib@123"))
                .role(User.Role.LIBRARIAN).active(true).phone("9000000002").build());

        User member1 = userRepository.save(User.builder()
                .email("member@library.com").name("Rahul Mehta")
                .password(passwordEncoder.encode("Member@123"))
                .role(User.Role.MEMBER).active(true).phone("9000000003")
                .address("12 MG Road, Bengaluru").build());

        User member2 = userRepository.save(User.builder()
                .email("ananya@library.com").name("Ananya Iyer")
                .password(passwordEncoder.encode("Member@123"))
                .role(User.Role.MEMBER).active(true).phone("9000000004")
                .address("45 Indiranagar, Bengaluru").build());

        // ── Categories ──────────────────────────────────────────────────────
        Category fiction     = categoryRepository.save(Category.builder().name("Fiction").description("Fictional literature").build());
        Category technology  = categoryRepository.save(Category.builder().name("Technology").description("Science and tech books").build());
        Category science     = categoryRepository.save(Category.builder().name("Science").description("Natural and applied sciences").build());
        Category history     = categoryRepository.save(Category.builder().name("History").description("Historical accounts").build());
        Category selfHelp    = categoryRepository.save(Category.builder().name("Self Help").description("Personal development").build());

        // ── Books ────────────────────────────────────────────────────────────
        Book b1 = bookRepository.save(Book.builder()
                .title("Clean Code").author("Robert C. Martin").isbn("978-0132350884")
                .publisher("Prentice Hall").publishedYear(2008).totalCopies(3).availableCopies(2)
                .description("A handbook of agile software craftsmanship.")
                .coverImageUrl("https://covers.openlibrary.org/b/id/8739161-L.jpg")
                .categories(Set.of(technology)).build());

        Book b2 = bookRepository.save(Book.builder()
                .title("The Great Gatsby").author("F. Scott Fitzgerald").isbn("978-0743273565")
                .publisher("Scribner").publishedYear(1925).totalCopies(5).availableCopies(5)
                .description("A classic American novel set in the Jazz Age.")
                .coverImageUrl("https://covers.openlibrary.org/b/id/8432472-L.jpg")
                .categories(Set.of(fiction)).build());

        Book b3 = bookRepository.save(Book.builder()
                .title("A Brief History of Time").author("Stephen Hawking").isbn("978-0553380163")
                .publisher("Bantam Books").publishedYear(1988).totalCopies(2).availableCopies(1)
                .description("Landmark exploration of cosmology for general readers.")
                .coverImageUrl("https://covers.openlibrary.org/b/id/8739199-L.jpg")
                .categories(Set.of(science)).build());

        Book b4 = bookRepository.save(Book.builder()
                .title("Sapiens").author("Yuval Noah Harari").isbn("978-0062316097")
                .publisher("Harper").publishedYear(2011).totalCopies(4).availableCopies(3)
                .description("A brief history of humankind.")
                .coverImageUrl("https://covers.openlibrary.org/b/id/8739164-L.jpg")
                .categories(Set.of(history, science)).build());

        Book b5 = bookRepository.save(Book.builder()
                .title("Atomic Habits").author("James Clear").isbn("978-0735211292")
                .publisher("Avery").publishedYear(2018).totalCopies(3).availableCopies(3)
                .description("An easy and proven way to build good habits.")
                .coverImageUrl("https://covers.openlibrary.org/b/id/10519831-L.jpg")
                .categories(Set.of(selfHelp)).build());

        Book b6 = bookRepository.save(Book.builder()
                .title("The Pragmatic Programmer").author("Andrew Hunt").isbn("978-0201616224")
                .publisher("Addison-Wesley").publishedYear(1999).totalCopies(2).availableCopies(2)
                .description("Your journey to mastery in software engineering.")
                .categories(Set.of(technology)).build());

        // ── Sample borrow record ─────────────────────────────────────────────
        borrowRepository.save(BorrowRecord.builder()
                .book(b1).user(member1)
                .issueDate(LocalDate.now().minusDays(5))
                .dueDate(LocalDate.now().plusDays(9))
                .status(BorrowRecord.Status.ACTIVE).build());

        borrowRepository.save(BorrowRecord.builder()
                .book(b3).user(member2)
                .issueDate(LocalDate.now().minusDays(20))
                .dueDate(LocalDate.now().minusDays(6))
                .status(BorrowRecord.Status.OVERDUE).build());

        log.info("Database seeded successfully!");
        log.info("Admin: admin@library.com / Admin@123");
        log.info("Librarian: librarian@library.com / Lib@123");
        log.info("Member: member@library.com / Member@123");
    }
}
