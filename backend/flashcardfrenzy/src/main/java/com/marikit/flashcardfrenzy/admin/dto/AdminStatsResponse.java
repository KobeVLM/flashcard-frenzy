package com.marikit.flashcardfrenzy.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;
    private long activeUsers;
    private long totalDecks;
    private long totalCards;
}
