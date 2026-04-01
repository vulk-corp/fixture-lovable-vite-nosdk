
-- Create trigger to clean up old rate limits on every insert
CREATE TRIGGER cleanup_rate_limits_trigger
  AFTER INSERT ON public.rate_limits
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_rate_limits();

-- Add RLS policy for rate_limits to allow edge functions (service role bypasses RLS, but add select/insert/update/delete for completeness)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
