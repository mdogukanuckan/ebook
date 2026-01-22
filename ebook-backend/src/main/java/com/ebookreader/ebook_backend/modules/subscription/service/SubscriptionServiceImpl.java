package com.ebookreader.ebook_backend.modules.subscription.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionResponseDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Subscription;
import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import com.ebookreader.ebook_backend.modules.subscription.mapper.SubscriptionMapper;
import com.ebookreader.ebook_backend.modules.subscription.repository.SubscriptionRepository;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService{

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    @Transactional
    public SubscriptionResponseDTO assignPlan(SubscriptionRequestDTO request) {

        log.info("Abonelik atama işlemi başlatıldı. UserID: {}, Plan: {}", request.getUserId(), request.getPlan());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + request.getUserId()));
        Subscription subscription = subscriptionRepository.findByUserId(request.getUserId())
                .orElse(Subscription.builder().user(user).build());
        subscription.setPlan(request.getPlan());
        subscription.setStartDate(LocalDateTime.now());
        subscription.setAutoRenew(request.isAutoRenew());
        subscription.setActive(true);

        if (request.getPlan() == SubscriptionPlan.FREE) {
            subscription.setEndDate(null);
            subscription.setPrice(BigDecimal.ZERO);
        } else {
            subscription.setEndDate(LocalDateTime.now().plusMonths(1));
            subscription.setPrice(request.getCustomPrice() != null ? request.getCustomPrice() : new BigDecimal("99.90"));
        }

        Subscription saved = subscriptionRepository.save(subscription);
        log.info("Abonelik başarıyla kaydedildi. Subscription ID: {}", saved.getId());

        return subscriptionMapper.toResponse(saved);
    }

    @Override
    public SubscriptionResponseDTO getUserSubscription() {
        User currentUser = getCurrentAuthenticatedUser();
        Subscription subscription = subscriptionRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Aboneliğiniz bulunmamaktadır"));

        return subscriptionMapper.toResponse(subscription);
    }



    @Override
    public boolean canAccessBook(Long userId, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Kitap bulunamadı."));

        if (book.getRequiredPlan() == SubscriptionPlan.FREE) {
            return true;
        }

        return subscriptionRepository.findByUserId(userId)
                .map(sub -> {
                   boolean isActive = sub.isValid();
                    boolean hasLevel = sub.getPlan().ordinal() >= book.getRequiredPlan().ordinal();

                    log.info("Erişim Kontrolü - User: {}, Plan: {}, Book Req: {}, Karar: {}",
                            userId, sub.getPlan(), book.getRequiredPlan(), (isActive && hasLevel));

                    return isActive && hasLevel;
                })
                .orElse(false);
    }

    @Override
    @Transactional
    public void createDefaultSubscription(User user) {

        log.info("Yeni kullanıcı için varsayılan FREE abonelik tanımlanıyor: {}"+user.getUsername());
        Subscription defaultSubscription = Subscription.builder()
                .user(user)
                .plan(SubscriptionPlan.FREE)
                .price(BigDecimal.ZERO)
                .currency("TRY")
                .startDate(LocalDateTime.now())
                .endDate(null)
                .autoRenew(false)
                .isActive(true)
                .build();
        subscriptionRepository.save(defaultSubscription);

    }


    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = (principal instanceof UserDetails) ?
                ((UserDetails) principal).getUsername() : principal.toString();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Kullanıcı bağlamı bulunamadı!"));
    }
    
}
