-- CreateTable: Agregar campo isSelected a UserCompany para manejar compañía seleccionada
-- Solo UN UserCompany por usuario puede tener isSelected = true

-- Agregar campo isSelected a la tabla user_companies
ALTER TABLE "user_companies" ADD COLUMN "is_selected" BOOLEAN NOT NULL DEFAULT false;

-- Crear índice para optimizar consultas de compañía seleccionada por usuario
CREATE INDEX "user_companies_user_id_is_selected_idx" ON "user_companies"("user_id", "is_selected");

-- Crear constraint para asegurar que solo UNA compañía esté seleccionada por usuario
-- Esto se manejará a nivel de aplicación para mayor flexibilidad
