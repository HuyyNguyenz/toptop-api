import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  register(body: any) {
    return {
      message: 'Register success',
      data: body
    }
  }
}
