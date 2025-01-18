import { PrismaClient } from '../../../../prisma/secondary-db-schema/generated/secondaryClient'; // Import from the correct path

const prismaClientSecondarySingleton = () => {
  return new PrismaClient(); // Uses secondary-db/schema.prisma
};

declare const globalThis: {
  prismaSecondaryGlobal: ReturnType<typeof prismaClientSecondarySingleton>;
} & typeof global;

const prismaSecondary = globalThis.prismaSecondaryGlobal ?? prismaClientSecondarySingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaSecondaryGlobal = prismaSecondary;

export const dbSecondary = prismaSecondary; // Exporting the secondary database client
