import { SHA256 } from 'crypto-js'

export const hashPassword = (password: string) => {
  return SHA256(password).toString()
}
