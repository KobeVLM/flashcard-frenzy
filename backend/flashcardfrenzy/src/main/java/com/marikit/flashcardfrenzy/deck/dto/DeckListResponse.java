package com.marikit.flashcardfrenzy.deck.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeckListResponse {

    private List<DeckResponse> decks;
    private PaginationMeta pagination;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMeta {
        private int page;
        private int limit;
        private long total;
        private int pages;
    }
}
