-- Add section_variants JSONB to portfolio_config
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'portfolio_config'
      AND column_name = 'section_variants'
  ) THEN
    ALTER TABLE public.portfolio_config
      ADD COLUMN section_variants jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;


