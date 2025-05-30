// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { RegisterUserInput, LoginUserInput } from './auth.validation';
// import { config } from '../../config'; // If using cookies

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
) => {
  const user = await authService.registerUser(req.body);
  // Consider what to return. Usually, you might log them in directly or just confirm registration.
  // For now, just return the user data (without password).
  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: user,
  });
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
) => {
  const { user, accessToken /*, refreshToken */ } = await authService.loginUser(req.body);

  // Option 1: Send tokens in the response body (common for SPAs)
  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user,
      accessToken,
      // refreshToken,
    },
  });

  // Option 2: Send tokens as HttpOnly cookies (can be more secure against XSS)
  // res.cookie(config.jwt.accessTokenCookieName, accessToken, {
  //   httpOnly: true,
  //   secure: config.env === 'production', // Use secure cookies in production (HTTPS)
  //   maxAge: 10 * 60 * 1000, // 10 minutes in milliseconds
  //   sameSite: 'lax', // Or 'strict'
  // });
  // if (refreshToken) {
  //   res.cookie(config.jwt.refreshTokenCookieName, refreshToken, {
  //     httpOnly: true,
  //     secure: config.env === 'production',
  //     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  //     sameSite: 'lax',
  //     // path: '/api/v1/auth/refresh-token' // Important: scope refresh token cookie path
  //   });
  // }
  // res.status(200).json({
  //   success: true,
  //   message: 'Login successful.',
  //   data: { user },
  // });
};

export const getMeHandler = async (req: Request, res: Response) => {
    // req.user is populated by the `protect` middleware
    if (!req.user) {
        // This case should ideally be caught by the protect middleware itself
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const userProfile = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: userProfile });
};

// (Optional) Logout Handler
// export const logoutHandler = async (req: Request, res: Response) => {
//   // If using cookies:
//   // res.cookie(config.jwt.accessTokenCookieName, '', { httpOnly: true, expires: new Date(0) });
//   // res.cookie(config.jwt.refreshTokenCookieName, '', { httpOnly: true, expires: new Date(0) });
//   res.status(200).json({ success: true, message: 'Logged out successfully' });
// };