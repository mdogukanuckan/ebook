package com.ebookreader.ebook_backend.modules.user.service;

import com.ebookreader.ebook_backend.common.exception.BusinessException;
import com.ebookreader.ebook_backend.common.exception.ResourceNotFoundException;
import com.ebookreader.ebook_backend.modules.user.dto.UserCreateDTO;
import com.ebookreader.ebook_backend.modules.user.dto.UserResponseDTO;
import com.ebookreader.ebook_backend.modules.user.entity.User;
import com.ebookreader.ebook_backend.modules.user.mapper.UserMapper;
import com.ebookreader.ebook_backend.modules.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponseDTO createUser(UserCreateDTO userCreateDto) {
        if (userRepository.existByUsername(userCreateDto.getUsername())){
            throw new BusinessException("Kullanıcı adı kullanılmaktadır");
        }
        if (userRepository.existByEmail(userCreateDto.getEmail())){
            throw new BusinessException("Mail adresi kullanılmaktadır");
        }
        User user = User.builder()
                .username(userCreateDto.getUsername())
                .email(userCreateDto.getEmail())
                .password(userCreateDto.getPassoword())
                .firstName(userCreateDto.getFirstName())
                .lastName(userCreateDto.getLastName())
                .build();
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->new ResourceNotFoundException("Kullanıcı bulunamadı! ID:"+id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserByUserName(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("Kullanıcı adı bulunamadı: "+username));

        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll().stream().map(userMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        userRepository.delete(user);
    }
}
