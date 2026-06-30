'use client'

import { useState, useMemo } from 'react'

interface Appointment {
  id: string
  service_name: string
  client_name?: string
  date: string
  time: string
  status: string
  price?: number
}

interface AgendaViewProps {
  appointments: Appointment[]
}

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const HORAS = Array.from({ length: 14 }, (_, i) => i + 7) // 7h às 20h

export function AgendaView({ appointments }: AgendaViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('list')

  // Início da semana (segunda-feira)
  const weekStart = useMemo(() => {
    const d = new Date(currentDate)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    return d
  }, [currentDate])

  // Dias da semana
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  // Formato da data para comparação
  const formatDateStr = (d: Date) => d.toISOString().split('T')[0]

  // Agendamentos do dia selecionado
  const todayStr = formatDateStr(currentDate)
  const dayAppointments = appointments.filter(a => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time))

  // Agendamentos da semana (para a view semanal)
  const weekAppointments = useMemo(() => {
    const start = formatDateStr(weekDays[0])
    const end = formatDateStr(weekDays[6])
    return appointments.filter(a => a.date >= start && a.date <= end)
  }, [appointments, weekDays])

  const isToday = (d: Date) => formatDateStr(d) === formatDateStr(new Date())
  const isSelected = (d: Date) => formatDateStr(d) === formatDateStr(currentDate)

  const navigateWeek = (dir: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + (dir * 7))
    setCurrentDate(d)
  }

  const navigateDay = (dir: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + dir)
    setCurrentDate(d)
  }

  const goToToday = () => setCurrentDate(new Date())

  const statusColor = (status: string) => {
    switch(status) {
      case 'confirmado': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }
  
  const statusLabel = (status: string) => {
    switch(status) {
      case 'confirmado': return 'Confirmado'
      case 'completed': return 'Concluído'
      default: return 'Pendente'
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-surface shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 border border-border rounded-md text-sm hover:bg-surface-container-high transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => viewMode === 'day' ? navigateDay(-1) : navigateWeek(-1)} 
              className="text-text-muted hover:text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="text-sm font-semibold min-w-[180px] text-center text-on-surface">
              {viewMode === 'day' 
                ? currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                : `${weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`
              }
            </span>
            <button 
              onClick={() => viewMode === 'day' ? navigateDay(1) : navigateWeek(1)} 
              className="text-text-muted hover:text-on-surface p-1 rounded hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex bg-surface-container-high rounded-lg p-1 border border-border">
          {[
            { key: 'day' as const, label: 'Dia' },
            { key: 'list' as const, label: 'Lista' },
            { key: 'week' as const, label: 'Semana' },
          ].map(mode => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode.key 
                  ? 'bg-surface text-on-surface shadow-sm border border-border' 
                  : 'text-text-muted hover:text-on-surface'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {viewMode === 'list' ? (
          /* LIST VIEW - Clean and readable */
          <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-on-surface">
                {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {dayAppointments.length} {dayAppointments.length === 1 ? 'agendamento' : 'agendamentos'}
              </p>
            </div>

            {dayAppointments.length > 0 ? (
              <div className="space-y-3">
                {dayAppointments.map(apt => (
                  <div key={apt.id} className="flex gap-4 group">
                    {/* Time */}
                    <div className="w-16 pt-3 text-right shrink-0">
                      <span className="text-sm font-medium text-text-muted">{apt.time}</span>
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1 bg-surface border border-border rounded-lg p-4 hover:border-border-bright transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-on-surface">{apt.service_name}</h3>
                          {apt.client_name && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="material-symbols-outlined text-[14px] text-text-muted">person</span>
                              <span className="text-xs text-text-muted">{apt.client_name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {apt.price && (
                            <span className="text-xs font-medium text-primary">
                              {Number(apt.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${statusColor(apt.status)}`}>
                            {statusLabel(apt.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-4">event_busy</span>
                <h3 className="text-base font-medium text-on-surface mb-1">Nenhum agendamento</h3>
                <p className="text-sm text-text-muted">Nenhum agendamento marcado para este dia.</p>
              </div>
            )}

            {/* Quick week overview */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Visão da Semana</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => {
                  const dayStr = formatDateStr(day)
                  const count = appointments.filter(a => a.date === dayStr).length
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentDate(new Date(day))}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        isSelected(day) 
                          ? 'bg-primary-container border border-primary/30' 
                          : isToday(day) 
                            ? 'bg-surface-container-high border border-border-bright' 
                            : 'hover:bg-surface-container-high border border-transparent'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold uppercase ${
                        isSelected(day) ? 'text-primary' : 'text-text-muted'
                      }`}>
                        {DIAS_SEMANA[day.getDay()]}
                      </span>
                      <span className={`text-lg font-semibold mt-0.5 ${
                        isSelected(day) ? 'text-on-surface' : 'text-text-muted'
                      }`}>
                        {day.getDate()}
                      </span>
                      {count > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : viewMode === 'day' ? (
          /* DAY VIEW - Hour grid */
          <div className="flex relative">
            {/* Time Labels */}
            <div className="w-16 shrink-0 border-r border-border bg-surface">
              {HORAS.map(hour => (
                <div key={hour} className="h-16 flex items-start justify-end pr-2 pt-0">
                  <span className="text-[10px] font-medium text-text-muted -mt-2">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
            
            {/* Day Grid */}
            <div className="flex-1 relative">
              {/* Hour lines */}
              {HORAS.map(hour => (
                <div key={hour} className="h-16 border-b border-border/30"></div>
              ))}
              
              {/* Events */}
              {dayAppointments.map(apt => {
                const [h, m] = apt.time.split(':').map(Number)
                const top = (h - 7) * 64 + (m / 60) * 64
                return (
                  <div
                    key={apt.id}
                    className="absolute left-1 right-4 bg-primary-container border border-primary/30 rounded-md p-2 cursor-pointer hover:border-primary transition-colors z-10"
                    style={{ top: `${top}px`, minHeight: '48px' }}
                  >
                    <p className="text-xs font-medium text-on-surface truncate">{apt.service_name}</p>
                    <p className="text-[10px] text-text-muted">{apt.time}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* WEEK VIEW - Column grid */
          <div className="flex relative min-h-0">
            {/* Time Labels */}
            <div className="w-16 shrink-0 border-r border-border bg-surface">
              {HORAS.map(hour => (
                <div key={hour} className="h-16 flex items-start justify-end pr-2 pt-0">
                  <span className="text-[10px] font-medium text-text-muted -mt-2">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
            
            {/* Day Columns */}
            <div className="flex-1 grid grid-cols-7">
              {weekDays.map((day, colIdx) => {
                const dayStr = formatDateStr(day)
                const dayApts = weekAppointments.filter(a => a.date === dayStr)
                
                return (
                  <div key={colIdx} className={`relative border-r border-border/30 ${
                    isToday(day) ? 'bg-primary-container/5' : ''
                  }`}>
                    {/* Header */}
                    <div className={`sticky top-0 z-20 py-2 text-center border-b border-border bg-surface ${
                      isToday(day) ? 'bg-primary-container/10' : ''
                    }`}>
                      <div className={`text-[10px] font-semibold uppercase ${
                        isToday(day) ? 'text-primary' : 'text-text-muted'
                      }`}>
                        {DIAS_SEMANA[day.getDay()]}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isToday(day) ? 'text-primary' : 'text-on-surface'
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                    
                    {/* Hour grid */}
                    <div className="relative">
                      {HORAS.map(hour => (
                        <div key={hour} className="h-16 border-b border-border/20"></div>
                      ))}
                      
                      {/* Events */}
                      {dayApts.map(apt => {
                        const [h, m] = apt.time.split(':').map(Number)
                        const top = (h - 7) * 64 + (m / 60) * 64
                        return (
                          <div
                            key={apt.id}
                            className="absolute left-0.5 right-0.5 bg-primary-container border border-primary/30 rounded p-1.5 cursor-pointer hover:border-primary transition-colors z-10"
                            style={{ top: `${top}px`, minHeight: '40px' }}
                          >
                            <p className="text-[10px] font-medium text-on-surface truncate">{apt.service_name}</p>
                            <p className="text-[9px] text-text-muted">{apt.time}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
