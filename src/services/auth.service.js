import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { userRepository } from '../repositories/user.repository.js';
import { refreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';

export const authService = {
  register: async (data) => {
    const { email, username, password, firstName, lastName } = data;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  login: async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    // Log activity
    await activityRepository.create({
      userId: user.id,
      type: 'PROFILE_UPDATED',
      metadata: JSON.stringify({ action: 'login' }),
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (token) => {
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    // Check if token exists and is not revoked
    const refreshTokenRecord = await refreshTokenRepository.findByToken(token);
    if (!refreshTokenRecord || refreshTokenRecord.revokedAt) {
      throw new Error('Refresh token not found or revoked');
    }

    // Check if token is expired
    if (refreshTokenRecord.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    // Get user
    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Revoke old token
    await refreshTokenRepository.revoke(token);

    // Generate new tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Store new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (token) => {
    if (token) {
      await refreshTokenRepository.revoke(token);
    }
  },

  logoutAll: async (userId) => {
    await refreshTokenRepository.revokeAllForUser(userId);
  },
};

