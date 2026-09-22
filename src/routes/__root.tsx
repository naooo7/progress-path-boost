import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, LibraryBig, ChartNoAxesCombined, UserRound, Dumbbell } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../hooks/use-theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FastLearner" },
      { name: "description", content: "Learn, practice, review, and master your exams." },
      { name: "author", content: "FastLearner" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-background/90 backdrop-blur-xl md:block">
          <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
            <Link to="/" className="font-display text-lg font-bold text-foreground">FastLearner<span className="text-primary">.</span></Link>
            <nav className="flex items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-soft">
              {navItems.map(({ label, to }) => (
                <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>{label}</Link>
              ))}
            </nav>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-semibold text-foreground">N</div>
          </div>
        </header>
        <main className="pb-24 md:pb-8"><Outlet /></main>
        <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-float backdrop-blur-xl md:hidden">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium text-muted-foreground" activeProps={{ className: "bg-secondary text-primary" }}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />{label}
            </Link>
          ))}
        </nav>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const navItems = [
  { label: "Home", to: "/" as const, icon: Home },
  { label: "Learn", to: "/learn" as const, icon: LibraryBig },
  { label: "Drill", to: "/drill" as const, icon: Dumbbell },
  { label: "Progress", to: "/progress" as const, icon: ChartNoAxesCombined },
  { label: "Profile", to: "/profile" as const, icon: UserRound },
];
