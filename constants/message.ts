export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'We have sent you an email to verify your account',
  LOGIN_SUCCESS: 'User logged in successfully',
  EMAIL_EXIST: 'Email already exist',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  VERIFY_EMAIL_SUCCESS: 'Verify email successfully',
  VERIFY_EMAIL_TOKEN_EXPIRED_OR_INVALID: 'Verify email token expired or invalid',
  YOU_ARE_NOT_AUTHENTICATED: 'You are not authenticated',
  ACCESS_TOKEN_EXPIRED_OR_INVALID: 'Access token expired or invalid',
  REFRESH_TOKEN_EXPIRED_OR_INVALID: 'Refresh token expired or invalid',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully'
} as const

export const USER_MESSAGES = {
  USER_NOT_FOUND: 'User not found'
} as const
