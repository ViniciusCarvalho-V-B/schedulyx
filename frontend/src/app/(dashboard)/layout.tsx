import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      {/* O conteúdo principal é empurrado pela largura da sidebar md:ml-64 */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden h-full">
        {children}
      </div>
    </div>
  )
}
