export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-slate-900 h-[100dvh]">
      {children}
    </main>
  )
}
