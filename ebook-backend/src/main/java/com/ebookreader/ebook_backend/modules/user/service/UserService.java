package com.ebookreader.ebook_backend.modules.user.service;

import com.ebookreader.ebook_backend.modules.user.dto.PasswordChangeDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserCreateDTO userCreateDto);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO getUserByUserName(String username);

    List<UserResponseDTO> getAllUsers();

    void deleteUser(Long id);

    // Settings page methods
    UserResponseDTO updateUser(Long id, UserUpdateDTO userUpdateDTO);

    void changePassword(Long id, PasswordChangeDTO passwordChangeDTO);

    UserResponseDTO getCurrentUser(String username);

    UserResponseDTO updateUserByAdmin(Long id,
            com.ebookreader.ebook_backend.modules.user.dto.UserAdminUpdateDTO request);
}
