import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetRefreshToken = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  if (data) {
    return request.refresh_token_decoded[data]
  }
  return request.refresh_token_decoded
})
