package com.ebookreader.ebook_backend.modules.subscription.service;

import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.repository.BookRepository;
import com.ebookreader.ebook_backend.modules.subscription.dto.SubscriptionRequestDTO;
import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import com.ebookreader.ebook_backend.modules.subscription.entity.Subscription;
import com.ebookreader.ebook_backend.modules.subscription.entity.SubscriptionPlan;
import com.ebookreader.ebook_backend.modules.subscription.mapper.SubscriptionMapper;
import com.ebookreader.ebook_backend.modules.subscription.repository.PlanRepository;
import com.ebookreader.ebook_backend.modules.subscription.repository.SubscriptionRepository;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceImplTest {

    private static final long USER_ID = 10L;
    private static final long BOOK_ID = 5L;

    @Mock
    private SubscriptionRepository subscriptionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private SubscriptionMapper subscriptionMapper;
    @Mock
    private PlanRepository planRepository;

    @InjectMocks
    private SubscriptionServiceImpl service;

    private static Book bookRequiring(SubscriptionPlan plan) {
        return Book.builder().requiredPlan(plan).build();
    }

    private static Subscription subscription(SubscriptionPlan plan, LocalDateTime endDate, boolean active) {
        return Subscription.builder().plan(plan).endDate(endDate).isActive(active).build();
    }

    @Nested
    class CanAccessBook {

        private void givenBook(SubscriptionPlan required) {
            when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(bookRequiring(required)));
        }

        private void givenSubscription(Subscription subscription) {
            when(subscriptionRepository.findByUserId(USER_ID)).thenReturn(Optional.ofNullable(subscription));
        }

        @Test
        void freeBook_isAccessibleWithoutLookingUpSubscription() {
            givenBook(SubscriptionPlan.FREE);

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isTrue();
            verifyNoInteractions(subscriptionRepository);
        }

        @Test
        void unknownBook_throwsNotFound() {
            when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.canAccessBook(USER_ID, BOOK_ID))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        void premiumBook_withoutSubscription_isDenied() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(null);

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isFalse();
        }

        @Test
        void premiumBook_withFreePlan_isDenied() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.FREE, null, true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isFalse();
        }

        @Test
        void premiumBook_withPremiumPlan_isAllowed() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.PREMIUM, LocalDateTime.now().plusDays(1), true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isTrue();
        }

        @Test
        void premiumBook_withVipPlan_isAllowed() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.VIP, LocalDateTime.now().plusDays(1), true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isTrue();
        }

        @Test
        void vipBook_withPremiumPlan_isDenied() {
            givenBook(SubscriptionPlan.VIP);
            givenSubscription(subscription(SubscriptionPlan.PREMIUM, LocalDateTime.now().plusDays(1), true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isFalse();
        }

        @Test
        void expiredSubscription_isDeniedEvenWithSufficientPlan() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.VIP, LocalDateTime.now().minusMinutes(1), true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isFalse();
        }

        @Test
        void inactiveSubscription_isDeniedEvenWithSufficientPlan() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.VIP, LocalDateTime.now().plusDays(1), false));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isFalse();
        }

        @Test
        void subscriptionWithoutEndDate_isTreatedAsNonExpiring() {
            givenBook(SubscriptionPlan.PREMIUM);
            givenSubscription(subscription(SubscriptionPlan.PREMIUM, null, true));

            assertThat(service.canAccessBook(USER_ID, BOOK_ID)).isTrue();
        }
    }

    @Nested
    class AssignPlan {

        private final User user = User.builder().username("ali").build();

        private SubscriptionRequestDTO request(SubscriptionPlan plan, BigDecimal customPrice, boolean autoRenew) {
            SubscriptionRequestDTO dto = new SubscriptionRequestDTO();
            dto.setUserId(USER_ID);
            dto.setPlan(plan);
            dto.setCustomPrice(customPrice);
            dto.setAutoRenew(autoRenew);
            return dto;
        }

        private Subscription assign(SubscriptionRequestDTO request, Optional<Subscription> existing) {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(subscriptionRepository.findByUserId(USER_ID)).thenReturn(existing);
            lenient().when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

            service.assignPlan(request);

            ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
            verify(subscriptionRepository).save(captor.capture());
            return captor.getValue();
        }

        @Test
        void unknownUser_throwsNotFoundAndSavesNothing() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.assignPlan(request(SubscriptionPlan.PREMIUM, null, true)))
                    .isInstanceOf(ResourceNotFoundException.class);
            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        void freePlan_hasNoEndDateAndZeroPrice() {
            Subscription saved = assign(request(SubscriptionPlan.FREE, new BigDecimal("50"), false), Optional.empty());

            assertThat(saved.getPlan()).isEqualTo(SubscriptionPlan.FREE);
            assertThat(saved.getEndDate()).isNull();
            assertThat(saved.getPrice()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(saved.isActive()).isTrue();
        }

        @Test
        void paidPlan_withoutCustomPrice_usesDefaultPriceAndOneMonthTerm() {
            LocalDateTime before = LocalDateTime.now();

            Subscription saved = assign(request(SubscriptionPlan.PREMIUM, null, true), Optional.empty());

            assertThat(saved.getPrice()).isEqualByComparingTo("99.90");
            assertThat(saved.getEndDate()).isBetween(before.plusMonths(1), LocalDateTime.now().plusMonths(1));
            assertThat(saved.isValid()).isTrue();
        }

        @Test
        void paidPlan_withCustomPrice_usesCustomPrice() {
            Subscription saved = assign(request(SubscriptionPlan.VIP, new BigDecimal("149.50"), true), Optional.empty());

            assertThat(saved.getPrice()).isEqualByComparingTo("149.50");
        }

        @Test
        void autoRenewFlag_isCopiedFromRequest() {
            Subscription saved = assign(request(SubscriptionPlan.PREMIUM, null, false), Optional.empty());

            assertThat(saved.isAutoRenew()).isFalse();
        }

        @Test
        void newSubscription_isLinkedToUser() {
            Subscription saved = assign(request(SubscriptionPlan.PREMIUM, null, true), Optional.empty());

            assertThat(saved.getUser()).isSameAs(user);
        }

        @Test
        void existingSubscription_isUpdatedInPlace() {
            Subscription existing = subscription(SubscriptionPlan.FREE, null, false);

            Subscription saved = assign(request(SubscriptionPlan.PREMIUM, null, true), Optional.of(existing));

            assertThat(saved).isSameAs(existing);
            assertThat(saved.getPlan()).isEqualTo(SubscriptionPlan.PREMIUM);
            assertThat(saved.isActive()).isTrue();
        }

        @Test
        void downgradeToFree_clearsPreviousEndDate() {
            Subscription existing = subscription(SubscriptionPlan.VIP, LocalDateTime.now().plusDays(10), true);

            Subscription saved = assign(request(SubscriptionPlan.FREE, null, false), Optional.of(existing));

            assertThat(saved.getEndDate()).isNull();
            assertThat(saved.getPrice()).isEqualByComparingTo(BigDecimal.ZERO);
        }
    }

    @Nested
    class SubscribeToPlan {

        private static final long PLAN_ID = 7L;
        private final User user = User.builder().username("ali").build();

        private Plan plan(SubscriptionPlan tier, boolean active) {
            return Plan.builder().name("Plan").price(new BigDecimal("49.90")).currency("TRY").durationDays(90)
                    .subscriptionPlan(tier).isActive(active).build();
        }

        private Subscription subscribe(Plan plan, Optional<Subscription> existing) {
            ReflectionTestUtils.setField(service, "selfServiceEnabled", true);
            when(planRepository.findById(PLAN_ID)).thenReturn(Optional.of(plan));
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(subscriptionRepository.findByUserId(USER_ID)).thenReturn(existing);
            when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

            service.subscribeToPlan(USER_ID, PLAN_ID);

            ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
            verify(subscriptionRepository).save(captor.capture());
            return captor.getValue();
        }

        @Test
        void whenSelfServiceDisabled_isDeniedAndNothingIsSaved() {
            ReflectionTestUtils.setField(service, "selfServiceEnabled", false);

            assertThatThrownBy(() -> service.subscribeToPlan(USER_ID, PLAN_ID))
                    .isInstanceOf(AccessDeniedException.class);
            verifyNoInteractions(subscriptionRepository, planRepository);
        }

        @Test
        void paidPlan_usesThePlansPriceCurrencyAndDuration() {
            LocalDateTime before = LocalDateTime.now();

            Subscription saved = subscribe(plan(SubscriptionPlan.PREMIUM, true), Optional.empty());

            assertThat(saved.getPlan()).isEqualTo(SubscriptionPlan.PREMIUM);
            assertThat(saved.getPrice()).isEqualByComparingTo("49.90");
            assertThat(saved.getCurrency()).isEqualTo("TRY");
            assertThat(saved.getEndDate()).isBetween(before.plusDays(90), LocalDateTime.now().plusDays(90));
            assertThat(saved.isActive()).isTrue();
            assertThat(saved.isAutoRenew()).isFalse();
            assertThat(saved.getUser()).isSameAs(user);
        }

        @Test
        void freePlan_hasNoEndDate() {
            Subscription saved = subscribe(plan(SubscriptionPlan.FREE, true), Optional.empty());

            assertThat(saved.getEndDate()).isNull();
        }

        @Test
        void existingSubscription_isUpdatedInPlace() {
            Subscription existing = subscription(SubscriptionPlan.FREE, null, true);

            Subscription saved = subscribe(plan(SubscriptionPlan.VIP, true), Optional.of(existing));

            assertThat(saved).isSameAs(existing);
            assertThat(saved.getPlan()).isEqualTo(SubscriptionPlan.VIP);
        }

        @Test
        void inactivePlan_isTreatedAsNotFound() {
            ReflectionTestUtils.setField(service, "selfServiceEnabled", true);
            when(planRepository.findById(PLAN_ID)).thenReturn(Optional.of(plan(SubscriptionPlan.PREMIUM, false)));

            assertThatThrownBy(() -> service.subscribeToPlan(USER_ID, PLAN_ID))
                    .isInstanceOf(ResourceNotFoundException.class);
            verify(subscriptionRepository, never()).save(any());
        }

        @Test
        void unknownPlan_throwsNotFound() {
            ReflectionTestUtils.setField(service, "selfServiceEnabled", true);
            when(planRepository.findById(PLAN_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.subscribeToPlan(USER_ID, PLAN_ID))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    class SubscriptionValidity {

        @Test
        void isValid_whenActiveAndEndDateInFuture() {
            assertThat(subscription(SubscriptionPlan.PREMIUM, LocalDateTime.now().plusSeconds(30), true).isValid()).isTrue();
        }

        @Test
        void isNotValid_whenEndDateInPast() {
            assertThat(subscription(SubscriptionPlan.PREMIUM, LocalDateTime.now().minusSeconds(1), true).isValid()).isFalse();
        }

        @Test
        void isNotValid_whenInactive() {
            assertThat(subscription(SubscriptionPlan.PREMIUM, null, false).isValid()).isFalse();
        }
    }
}
