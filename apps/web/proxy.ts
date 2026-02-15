import authProxy from './lib/middleware/auth.middleware'

export const proxy = authProxy

export const config = {
  matcher: [
    '/api/v1/me',
    '/api/v1/zap',
    '/api/v1/zap/(.*)',
    '/dashboard',
    '/zap/(.*)',
  ],
}
