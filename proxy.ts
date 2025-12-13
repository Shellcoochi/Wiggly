import { NextResponse, NextRequest } from 'next/server'

// 这是一个中间件函数，可以使用 `await` 来处理异步操作
export function proxy(request: NextRequest) {
  // 当访问根路径时，重定向到 /dashboard
  return NextResponse.redirect(new URL(process.env.BASE_PATH+'/dashboard', request.url))
}

// 配置matcher，匹配根路径（/）
export const config = {
  matcher: '/',
}
