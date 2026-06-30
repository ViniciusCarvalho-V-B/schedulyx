import { createClient } from '@/utils/supabase/server'
import { AgendaView } from '@/components/agenda/AgendaView'

export default async function AgendaPage() {
  const supabase = await createClient()

  // Buscar todos os agendamentos do usuário
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, service_name, client_name, date, time, status, price')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  return (
    <main className="flex-1 overflow-hidden flex flex-col bg-background">
      <AgendaView appointments={appointments || []} />
    </main>
  );
}
