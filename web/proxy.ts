import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Rotas públicas (acesso sem login)
    const isPublicRoute =
        pathname === "/" ||
        pathname === "/login" ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api/auth") || // Permitir rotas de auth
        pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/) !== null;

    // Se não tem token e tenta acessar rota privada
    if (!token && !isPublicRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Se tem token e tenta acessar login ou raiz, redireciona para dashboard
    if (token && (pathname === "/" || pathname === "/login")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};