package com.marikit.flashcardfrenzy.common;

import com.marikit.flashcardfrenzy.auth.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

    private SecurityUtil() {
        // Utility class — no instantiation
    }

    /**
     * Extract the currently authenticated User from the SecurityContext.
     */
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new AppException(
                    "AUTH-001",
                    "User not authenticated",
                    org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        return (User) authentication.getPrincipal();
    }
}
