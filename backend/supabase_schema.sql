-- ====================================================================================
-- SCHEDULYX - SUPABASE POSTGRESQL SCHEMA
-- ====================================================================================

-- 1. PROFILES TABLE
-- Extends the Supabase auth.users with custom roles and data
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'profissional', 'cliente')) DEFAULT 'cliente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. APPOINTMENTS TABLE
-- Manages scheduling between clients and professionals
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    professional_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TASKS TABLE (KANBAN)
-- Manages internal tasks, optionally linked to an appointment
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('A Fazer', 'Em Andamento', 'Concluído')) DEFAULT 'A Fazer',
    priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRANSACTIONS TABLE (FINANCIAL)
-- Manages income and expenses
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL
);

-- ====================================================================================
-- TRIGGERS & FUNCTIONS
-- ====================================================================================

-- Function: Create a Task when a new Appointment is scheduled
CREATE OR REPLACE FUNCTION handle_new_appointment_task()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO tasks (title, description, status, priority, appointment_id)
    VALUES (
        'Atendimento: ' || NEW.date || ' às ' || NEW.time,
        'Agendamento criado automaticamente. Preparar materiais/sala para o cliente.',
        'A Fazer',
        'media',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: After Insert on Appointments
CREATE TRIGGER trigger_new_appointment_task
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION handle_new_appointment_task();

-- Function: Auto-update task updated_at timestamp
CREATE OR REPLACE FUNCTION update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_task_timestamp();

-- Function: Create a Transaction (entrada) when a Task linked to an Appointment is 'Concluído'
CREATE OR REPLACE FUNCTION handle_task_completion_payment()
RETURNS TRIGGER AS $$
DECLARE
    appointment_price DECIMAL(10,2);
BEGIN
    -- Check if status changed to 'Concluído' and it's linked to an appointment
    IF NEW.status = 'Concluído' AND OLD.status != 'Concluído' AND NEW.appointment_id IS NOT NULL THEN
        
        -- Get the price of the appointment
        SELECT price INTO appointment_price FROM appointments WHERE id = NEW.appointment_id;

        -- Create the transaction
        IF appointment_price IS NOT NULL AND appointment_price > 0 THEN
            INSERT INTO transactions (description, amount, type, appointment_id)
            VALUES (
                'Receita de Agendamento (Concluído) - ' || NEW.title,
                appointment_price,
                'entrada',
                NEW.appointment_id
            );
        END IF;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: After Update on Tasks
CREATE TRIGGER trigger_task_completion_payment
AFTER UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION handle_task_completion_payment();

-- ====================================================================================
-- RLS (ROW LEVEL SECURITY) BOILERPLATE (Optional but recommended)
-- ====================================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Note: You should configure appropriate policies (CREATE POLICY) based on your needs.
