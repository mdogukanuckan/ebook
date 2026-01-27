package com.ebookreader.ebook_backend.modules.auth.service;

import com.ebookreader.ebook_backend.modules.user.dto.AuthResponseDTO;
import com.ebookreader.ebook_backend.modules.user.dto.LoginRequestDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import com.ebookreader.ebook_backend.modules.user.service.UserService;
import com.ebookreader.ebook_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public UserResponseDTO register(UserCreateDTO userCreateDTO) {
        return userService.createUser(userCreateDTO);
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsername(),
                        loginRequestDTO.getPassword()));
        var user = userRepository.findByUsername(loginRequestDTO.getUsername()).orElseThrow();
        var userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponseDTO.builder()
                .accessToken(jwtToken)
                .username(user.getUsername())
                .userId(user.getId())
                .roles(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()))
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public AuthResponseDTO getCurrentUser() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        var username = authentication.getName();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException(
                        "User not found"));

        return AuthResponseDTO.builder()
                .accessToken(null)
                .username(user.getUsername())
                .userId(user.getId())
                .roles(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()))
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
