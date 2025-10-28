-- AlterTable
ALTER TABLE "users_configuration" ADD COLUMN     "time_format_id" TEXT;
ALTER TABLE "users_configuration" ADD COLUMN     "language_id" TEXT;
ALTER TABLE "users_configuration" ADD COLUMN     "currency_id" TEXT;

-- Set default values for existing records
UPDATE "users_configuration" 
SET 
  "time_format_id" = (
    SELECT id FROM "time_formats" WHERE value = COALESCE("time_format", '24h') LIMIT 1
  ),
  "language_id" = (
    SELECT id FROM "languages" WHERE code = COALESCE("language", 'es') LIMIT 1  
  ),
  "currency_id" = (
    SELECT id FROM "currencies" WHERE code = COALESCE("currency", 'COP') LIMIT 1
  );

-- Drop old columns
ALTER TABLE "users_configuration" DROP COLUMN "time_format";
ALTER TABLE "users_configuration" DROP COLUMN "language";
ALTER TABLE "users_configuration" DROP COLUMN "currency";

-- AddForeignKey
ALTER TABLE "users_configuration" ADD CONSTRAINT "users_configuration_time_format_id_fkey" FOREIGN KEY ("time_format_id") REFERENCES "time_formats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_configuration" ADD CONSTRAINT "users_configuration_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_configuration" ADD CONSTRAINT "users_configuration_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
