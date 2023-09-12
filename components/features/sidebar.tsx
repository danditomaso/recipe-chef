export default function Sidebar({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <nav className="w-full h-full max-w-2xl flex flex-col justify-between items-center p-3 text-sm text-foreground">
      <aside className="w-full h-full flex flex-col justify-center border-r border-r-foreground/10 bg-white/40 backdrop-blur-lg py-10">
        <div className="w-full h-full max-w-2xl flex flex-col justify-between items-center p-3 text-sm text-foreground">

        </div>
      </aside>
    </nav>
  )
}
