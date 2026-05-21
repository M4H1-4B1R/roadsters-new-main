-- Resync all bigserial/identity sequences to MAX(id) of their table.
--
-- WHY: rows were imported from the legacy database with explicit IDs, but the
-- owning sequences were never advanced. Any new INSERT then asks the sequence
-- for an id that already exists, producing:
--   duplicate key value violates unique constraint "<table>_pkey"
-- This bit product_images first (5 rows, seq < 6); the same trap exists for
-- products, orders, order_items, etc. once the client starts uploading.
--
-- Safe to run multiple times (idempotent). Run in Supabase SQL Editor.

DO $$
DECLARE
  r        RECORD;
  seq_name TEXT;
  max_id   BIGINT;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'id'
  LOOP
    seq_name := pg_get_serial_sequence('public.' || quote_ident(r.table_name), 'id');
    IF seq_name IS NOT NULL THEN
      EXECUTE format('SELECT COALESCE(MAX(id), 0) FROM public.%I', r.table_name)
        INTO max_id;
      -- is_called = (max_id > 0): a populated table makes next id = max_id + 1;
      -- an empty table resets so the next id = 1.
      PERFORM setval(seq_name, GREATEST(max_id, 1), max_id > 0);
      RAISE NOTICE 'Reset % -> next id after %', seq_name, max_id;
    END IF;
  END LOOP;
END $$;
