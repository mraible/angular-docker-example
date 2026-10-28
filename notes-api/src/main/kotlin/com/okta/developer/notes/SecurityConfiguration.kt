package com.okta.developer.notes

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer.withDefaults
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter

@Configuration
class SecurityConfiguration {

    @Bean
    fun webSecurity(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { authz ->
                authz.requestMatchers("/", "/index.html", "/*.js", "/*.css", "/*.ico", "/*.svg").permitAll()
                authz.requestMatchers("/user").permitAll()
                authz.anyRequest().authenticated()
            }
            .oauth2Login(withDefaults())
            .oauth2ResourceServer { it.jwt(withDefaults()) }
            // XSRF-TOKEN cookie that Angular's HttpClient reads and sends back as an X-XSRF-TOKEN header
            .csrf { it.spa() }
            .addFilterAfter(SpaWebFilter(), BasicAuthenticationFilter::class.java)
            .headers { headers ->
                headers.contentSecurityPolicy { csp ->
                    csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
                            "img-src 'self' data:; font-src 'self' data:; frame-ancestors 'none'")
                }
                headers.frameOptions { it.deny() }
                headers.referrerPolicy { it.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN) }
                headers.permissionsPolicyHeader { it.policy("geolocation=(self), microphone=(), accelerometer=(), camera=()") }
            }

        return http.build()
    }
}
