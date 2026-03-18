package com.marikit.flashcardfrenzy.auth.security;

import com.marikit.flashcardfrenzy.common.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JsonMapper jsonMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            // Check if token is blacklisted
            if (tokenBlacklistService.isBlacklisted(jwt)) {
                writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "AUTH-001", "Token has been invalidated");
                return;
            }

            final String userEmail = jwtUtil.extractEmail(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
            writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "AUTH-002", "Token expired");
            return;
        } catch (Exception e) {
            writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "AUTH-001", "Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeErrorResponse(HttpServletResponse response, int status,
                                     String errorCode, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<Object> errorResponse = ApiResponse.error(errorCode, message, null);
        response.getWriter().write(jsonMapper.writeValueAsString(errorResponse));
    }
}
