package com.marikit.flashcardfrenzy.admin.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusRequest {

    @Pattern(regexp = "ACTIVE|INACTIVE", message = "Status must be ACTIVE or INACTIVE")
    private String status;
}
