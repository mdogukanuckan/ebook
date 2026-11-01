package com.ebookreader.ebook_backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.test.context.SpringBootTest;

// Boots the whole application against a real database, so it only runs when one is configured explicitly:
// SPRING_DATASOURCE_URL, SPRING_DATASOURCE_PASSWORD and JWT_SECRET_KEY must be set (use a throwaway database).
@SpringBootTest
@EnabledIfEnvironmentVariable(named = "SPRING_DATASOURCE_URL", matches = ".+")
@EnabledIfEnvironmentVariable(named = "SPRING_DATASOURCE_PASSWORD", matches = ".+")
@EnabledIfEnvironmentVariable(named = "JWT_SECRET_KEY", matches = ".+")
class EbookBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
