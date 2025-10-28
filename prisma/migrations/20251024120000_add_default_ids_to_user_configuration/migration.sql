-- Migration: Add default IDs to existing user configurations
-- This migration sets default values for timeFormatId, languageId, and currencyId

-- Update existing UserConfiguration records to have default IDs
UPDATE "users_configuration" 
SET 
  "time_format_id" = (
    SELECT id FROM "time_formats" WHERE value = '24h' LIMIT 1
  ),
  "language_id" = (
    SELECT id FROM "languages" WHERE code = 'es' LIMIT 1  
  ),
  "currency_id" = (
    SELECT id FROM "currencies" WHERE code = 'COP' LIMIT 1
  )
WHERE "time_format_id" IS NULL OR "language_id" IS NULL OR "currency_id" IS NULL;
