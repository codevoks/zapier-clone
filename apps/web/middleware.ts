import authmiddleware from './lib/middleware/auth.middleware'

export const middleware = authmiddleware

export const config = {
  matcher: ['/api/v1/me', '/api/v1/zap', '/zaps'],
}
