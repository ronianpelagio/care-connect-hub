
-- ============================================
-- EConsultCare+ Database Schema
-- ============================================

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'staff', 'patient');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  blood_type TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Doctor availability
CREATE TABLE public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;

-- 5. Appointments / Consultations
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled','no_show')),
  consultation_type TEXT NOT NULL DEFAULT 'online' CHECK (consultation_type IN ('online','in_person')),
  consent_recording BOOLEAN DEFAULT false,
  notes TEXT,
  triage_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- 6. Consultation transcripts
CREATE TABLE public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- 7. Prescriptions
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  qr_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','dispensed','cancelled')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- 8. Prescription items
CREATE TABLE public.prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
  drug_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT,
  duration TEXT,
  quantity INT NOT NULL DEFAULT 1,
  notes TEXT
);
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

-- 9. Pharmacy inventory
CREATE TABLE public.pharmacy_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name TEXT NOT NULL,
  generic_name TEXT,
  manufacturer TEXT,
  category TEXT,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  requires_prescription BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;

-- 10. Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prescription_id UUID REFERENCES public.prescriptions(id),
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','ready','completed','cancelled')),
  fulfillment_type TEXT NOT NULL DEFAULT 'pickup' CHECK (fulfillment_type IN ('pickup','delivery')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 11. Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  inventory_id UUID REFERENCES public.pharmacy_inventory(id) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 12. Lab results
CREATE TABLE public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_name TEXT NOT NULL,
  result_value TEXT,
  units TEXT,
  reference_range TEXT,
  collected_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

-- 13. AI triage results
CREATE TABLE public.ai_triage_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms JSONB NOT NULL DEFAULT '[]',
  assessment TEXT,
  recommended_department TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('routine','priority','emergency')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_triage_results ENABLE ROW LEVEL SECURITY;

-- 14. Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function: has_role
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_pharmacy_inventory_updated_at BEFORE UPDATE ON public.pharmacy_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

-- user_roles: users see own, admins see all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Doctors can view patient profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Staff can view profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Staff can create profiles" ON public.profiles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- doctor_availability
CREATE POLICY "Anyone can view availability" ON public.doctor_availability FOR SELECT USING (true);
CREATE POLICY "Doctors manage own availability" ON public.doctor_availability FOR ALL USING (auth.uid() = doctor_id);
CREATE POLICY "Admins manage availability" ON public.doctor_availability FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- consultations
CREATE POLICY "Patients see own consultations" ON public.consultations FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors see own consultations" ON public.consultations FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Admins see all consultations" ON public.consultations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors can create consultations" ON public.consultations FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'patient'));
CREATE POLICY "Doctors can update consultations" ON public.consultations FOR UPDATE USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

-- transcripts
CREATE POLICY "Consultation participants see transcripts" ON public.transcripts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.consultations c WHERE c.id = consultation_id AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid()))
);
CREATE POLICY "Admins see all transcripts" ON public.transcripts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create transcripts" ON public.transcripts FOR INSERT WITH CHECK (true);

-- prescriptions
CREATE POLICY "Patients see own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors see own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Admins see all prescriptions" ON public.prescriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'doctor'));

-- prescription_items
CREATE POLICY "Linked to prescription access" ON public.prescription_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_id AND (p.patient_id = auth.uid() OR p.doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Doctors can add items" ON public.prescription_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_id AND p.doctor_id = auth.uid())
);

-- pharmacy_inventory
CREATE POLICY "Anyone can browse inventory" ON public.pharmacy_inventory FOR SELECT USING (true);
CREATE POLICY "Staff/admin manage inventory" ON public.pharmacy_inventory FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- orders
CREATE POLICY "Patients see own orders" ON public.orders FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Admins see all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin/staff update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- order_items
CREATE POLICY "Order owner sees items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.patient_id = auth.uid())
);
CREATE POLICY "Order owner creates items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.patient_id = auth.uid())
);
CREATE POLICY "Admins see all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- lab_results
CREATE POLICY "Patients see own results" ON public.lab_results FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Admins see all results" ON public.lab_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors see patient results" ON public.lab_results FOR SELECT USING (
  public.has_role(auth.uid(), 'doctor') AND EXISTS (
    SELECT 1 FROM public.consultations c WHERE c.patient_id = lab_results.patient_id AND c.doctor_id = auth.uid()
  )
);

-- ai_triage_results
CREATE POLICY "Patients see own triage" ON public.ai_triage_results FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients create triage" ON public.ai_triage_results FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Doctors see patient triage" ON public.ai_triage_results FOR SELECT USING (public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Admins see all triage" ON public.ai_triage_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- audit_logs
CREATE POLICY "Admins see audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Storage buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('transcripts', 'transcripts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-results', 'lab-results', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', false);

-- Storage policies
CREATE POLICY "Users access own transcripts" ON storage.objects FOR SELECT USING (bucket_id = 'transcripts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users access own lab results" ON storage.objects FOR SELECT USING (bucket_id = 'lab-results' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users access own medical docs" ON storage.objects FOR SELECT USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own medical docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
