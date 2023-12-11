import { IsDateString, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string

  @IsNotEmpty()
  @IsString()
  first_name: string

  @IsNotEmpty()
  @IsString()
  last_name: string

  @IsDateString()
  date_of_birth: Date
}
