/*
  Warnings:

  - You are about to drop the column `company_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supabase_uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_company_id_fkey";

-- DropIndex
DROP INDEX "public"."users_supabase_uuid_company_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "company_id",
DROP COLUMN "role",
ADD COLUMN     "document_number" TEXT,
ADD COLUMN     "document_type" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "user_companies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_companies_user_id_company_id_key" ON "user_companies"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_uuid_key" ON "users"("supabase_uuid");

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
