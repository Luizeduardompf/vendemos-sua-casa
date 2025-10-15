import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Para rotas do dashboard, deixar o auth guard do cliente fazer a verificação
  // O middleware apenas adiciona headers de segurança
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
  
  // Adicionar headers de segurança
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
