import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            response.cookies.set(name, value, options);
          },
          remove: (name, options) => {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    await supabase.auth.getUser();

    return response;
  } catch (error) {
    console.error("Session Update Error:", error);
    return NextResponse.next();
  }
};
