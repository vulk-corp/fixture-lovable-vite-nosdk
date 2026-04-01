
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 hour';
  RETURN NEW;
END;
$$;
