import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { decrypt } from "@/server/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // List of routes that can be accessed by authenticated users or guests
  const routes = ["/"] as const;

  // List of public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up"] as const;
  type PublicRoute = (typeof publicRoutes)[number];

  const isPublicRoute = (path: string): path is PublicRoute =>
    publicRoutes.includes(path as PublicRoute);

  const isRoute = (path: string): path is (typeof routes)[number] =>
    !routes.includes(path as (typeof routes)[number]);

  if (!token && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token) {
    try {
      const payload = await decrypt(token);

      // Add user info to headers for route handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("user", JSON.stringify(payload));

      // If user is logged in and tries to access login/register (except home), redirect to dashboard
      if (
        isPublicRoute(request.nextUrl.pathname) &&
        isRoute(request.nextUrl.pathname)
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Token validation error:", error.message);
      }
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
