package com.marikit.flashcardfrenzy.auth.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    /**
     * Add a token to the blacklist with its expiry epoch time in milliseconds.
     */
    public void invalidate(String token, long expiryEpochMs) {
        blacklist.put(token, expiryEpochMs);
    }

    /**
     * Check whether a token has been blacklisted.
     */
    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    /**
     * Remove expired entries from the blacklist every hour (3600000 ms).
     */
    @Scheduled(fixedRate = 3600000)
    public void cleanup() {
        long now = System.currentTimeMillis();
        blacklist.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}
