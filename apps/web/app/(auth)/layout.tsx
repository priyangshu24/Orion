export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background dot-grid">
      <div className="w-full max-w-md p-4">{children}</div>
    </div>
  );
}
