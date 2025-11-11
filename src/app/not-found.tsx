// app/not-found.tsx
'use client';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
