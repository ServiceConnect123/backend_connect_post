-- CreateTable
CREATE TABLE "time_formats" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT,
    "country" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "time_formats_value_key" ON "time_formats"("value");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- Insert default time formats
INSERT INTO "time_formats" ("id", "value", "name", "description") VALUES
('tf1', '12h', '12 Hours', '12-hour format with AM/PM'),
('tf2', '24h', '24 Hours', '24-hour format');

-- Insert default languages
INSERT INTO "languages" ("id", "code", "name", "nativeName", "country") VALUES
('lang1', 'es', 'Spanish', 'Español', 'Colombia'),
('lang2', 'en', 'English', 'English', 'United States'),
('lang3', 'pt', 'Portuguese', 'Português', 'Brazil'),
('lang4', 'fr', 'French', 'Français', 'France');

-- Insert default currencies
INSERT INTO "currencies" ("id", "code", "name", "symbol", "country", "type", "decimalPlaces") VALUES
('curr1', 'COP', 'Colombian Peso', '$', 'Colombia', 'Pesos', 0),
('curr2', 'USD', 'US Dollar', '$', 'United States', 'Dollars', 2),
('curr3', 'EUR', 'Euro', '€', 'European Union', 'Euros', 2),
('curr4', 'BRL', 'Brazilian Real', 'R$', 'Brazil', 'Reales', 2),
('curr5', 'MXN', 'Mexican Peso', '$', 'Mexico', 'Pesos', 2);
