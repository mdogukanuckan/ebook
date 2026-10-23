package com.ebookreader.ebook_backend.common.base;

import com.ebookreader.ebook_backend.modules.book.entity.Author;
import com.ebookreader.ebook_backend.modules.book.entity.Book;
import com.ebookreader.ebook_backend.modules.book.entity.Category;
import com.ebookreader.ebook_backend.modules.readingprogress.entity.ReadingProgress;
import com.ebookreader.ebook_backend.modules.subscription.entity.Plan;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @SQLDelete metni derleme zamanında denetlenmediği için yazım hatası ancak ilk silmede
 * patlar (ör. "WHER"). Bu test her soft-delete entity'sinin SQL'ini tablo adıyla birlikte doğrular.
 */
class SoftDeleteMappingTest {

    @ParameterizedTest
    @ValueSource(classes = { Author.class, Book.class, Category.class, ReadingProgress.class, Plan.class })
    void softDeleteSql_isWellFormedAndTargetsOwnTable(Class<?> entity) {
        String table = entity.getAnnotation(Table.class).name();
        String sql = entity.getAnnotation(SQLDelete.class).sql();

        assertThat(sql).isEqualTo("UPDATE " + table + " SET is_deleted = true WHERE id=?");
    }

    @ParameterizedTest
    @ValueSource(classes = { Author.class, Book.class, Category.class, ReadingProgress.class, Plan.class })
    void softDeleteEntities_filterDeletedRowsOnRead(Class<?> entity) {
        assertThat(entity.getAnnotation(SQLRestriction.class).value()).isEqualTo("is_deleted = false");
    }
}
