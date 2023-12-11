import { generate } from 'otp-generator'

export const otpGenerator = (length: number, upperCaseAlphabets?: boolean, specialChars?: boolean) => {
  return generate(length, { upperCaseAlphabets, specialChars })
}
