
-- Fix overly permissive transcript insert policy
DROP POLICY "System can create transcripts" ON public.transcripts;

CREATE POLICY "Doctors can create transcripts" ON public.transcripts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.consultations c WHERE c.id = consultation_id AND c.doctor_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
