import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import MetricCard from "@/components/MetricCard";
import AgendaMini from "@/components/AgendaMini";
import UrgentTasks from "@/components/UrgentTasks";
import EarningsOverview from "@/components/EarningsOverview";

export default function DashboardPage() {
  return (
    <>
      <Sidebar />
      {/* Main Layout Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 w-full md:w-[calc(100%-16rem)]">
        <TopNavBar />
        
        {/* Main Content Canvas */}
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full overflow-y-auto">
          {/* Top Row (Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MetricCard 
              title="Próximos Agendamentos (Hoje)"
              icon="calendar_today"
              value="12"
              subtitle="+3 novos"
            />
            <MetricCard 
              title="Tarefas Pendentes no Kanban"
              icon="view_kanban"
              value="5"
              subtitle="2 atrasadas"
              subtitleColor="text-error"
            />
            <MetricCard 
              title="Faturamento do Mês"
              icon="payments"
              value="R$ 45.2K"
              valueColor="text-secondary-container"
              subtitle="+12% vs mês ant."
            />
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Split) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <AgendaMini />
              <UrgentTasks />
            </div>

            {/* Right Column: Visão Geral de Ganhos */}
            <EarningsOverview />
          </div>
        </main>
      </div>
    </>
  );
}
