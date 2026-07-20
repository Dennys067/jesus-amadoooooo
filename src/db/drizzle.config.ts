import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost) {
  // Diagnóstico automático do arquivo .env
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const buffer = fs.readFileSync(envPath);
    const hasBom = (buffer[0] === 0xfe && buffer[1] === 0xff) || 
                   (buffer[0] === 0xff && buffer[1] === 0xfe) || 
                   (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf);
    const isUtf16 = buffer.includes(0x00); // UTF-16 contém bytes nulos

    console.error("\n=== DIAGNÓSTICO DO ARQUIVO .env ===");
    console.error(`Caminho: ${envPath}`);
    console.error(`Tamanho: ${buffer.length} bytes`);
    console.error(`Tem BOM (Byte Order Mark): ${hasBom ? "Sim" : "Não"}`);
    console.error(`Provável codificação UTF-16 (comum no Windows/PowerShell): ${isUtf16 ? "Sim" : "Não"}`);
    console.error("====================================\n");

    if (isUtf16 || hasBom) {
      throw new Error(
        "ERRO DE CODIFICAÇÃO: O seu arquivo `.env` está codificado como UTF-16 (comum ao criar arquivos pelo PowerShell no Windows).\n\n" +
        "Para corrigir no VS Code:\n" +
        "1. Abra o seu arquivo `.env` no VS Code.\n" +
        "2. Olhe no canto inferior direito do VS Code (na barra de status) - ele provavelmente mostrará 'UTF-16 LE'.\n" +
        "3. Clique onde está escrito 'UTF-16 LE', selecione 'Salvar com Codificação' (Save with Encoding) e escolha 'UTF-8'.\n" +
        "4. Salve o arquivo e tente rodar `npm run db:push` novamente."
      );
    }
  } else {
    console.error(`\n[Aviso] O arquivo .env não foi encontrado no caminho esperado: ${envPath}\n`);
  }

  throw new Error("SQL_HOST must be set in environment variables.");
}

if (!sqlDbName) {
  throw new Error("SQL_DB_NAME must be set in environment variables.");
}
if (!user) {
  throw new Error("SQL_ADMIN_USER must be set in environment variables.");
}
if (!password) {
  throw new Error("SQL_ADMIN_PASSWORD must be set in environment variables.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : 5432,
    ssl: (process.env.SQL_SSL === "true" || !sqlHost.includes("localhost")) ? "require" : false,
  },
  verbose: true,
});
