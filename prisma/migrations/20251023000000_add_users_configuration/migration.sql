-- CreateTable
CREATE TABLE "users_configuration" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_format" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "time_format" TEXT NOT NULL DEFAULT '24h',
    "language" TEXT NOT NULL DEFAULT 'es',
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "decimal_separator" TEXT NOT NULL DEFAULT ',',
    "items_per_page" INTEGER NOT NULL DEFAULT 20,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "primary_color" TEXT NOT NULL DEFAULT '#1976d2',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_configuration_user_id_key" ON "users_configuration"("user_id");

-- AddForeignKey
ALTER TABLE "users_configuration" ADD CONSTRAINT "users_configuration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
