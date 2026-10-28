package com.okta.developer.notes

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(classes = [NotesApiApplication::class, MockSecurityConfiguration::class])
class NotesApiApplicationTests {

	@Test
	fun contextLoads() {
	}

}
