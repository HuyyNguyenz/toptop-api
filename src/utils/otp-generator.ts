import { generate } from 'otp-generator'

export const otpGenerator = (length: number) => {
  return generate(length, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
}
