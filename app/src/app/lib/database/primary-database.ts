import { PrismaClient } from '@prisma/client'; // Import from the correct path

const prismaClientPrimarySingleton = () => {
  return new PrismaClient(); // Uses primary-db/schema.prisma
};

declare const globalThis: {
  prismaPrimaryGlobal: ReturnType<typeof prismaClientPrimarySingleton>;
} & typeof global;

const prismaPrimary = globalThis.prismaPrimaryGlobal ?? prismaClientPrimarySingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaPrimaryGlobal = prismaPrimary;

export const dbPrimary = prismaPrimary; // Exporting the primary database client
