package com.ebookreader.ebook_backend.modules.user.service;


import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserCreateDTO userCreateDto);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByUserName(String username);
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Long id);

}
