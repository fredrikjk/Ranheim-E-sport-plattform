import { DEFAULT_ROLE_PERMISSIONS, ALL_PERMISSIONS } from "@ranheim/auth";
import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

const roleMeta = {
  player: { name: "Spiller", description: "Utøver i klubben" },
  coach: { name: "Trener", description: "Trener, kan scopes til lag" },
  board: { name: "Styre", description: "Klubbadministrasjon" },
  admin: { name: "Admin", description: "Teknisk administrator" },
} as const;

async function main() {
  for (const slug of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug },
      update: { name: slug },
      create: { slug, name: slug },
    });
  }

  for (const [slug, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const meta = roleMeta[slug as keyof typeof roleMeta];
    const role = await prisma.role.upsert({
      where: { slug },
      update: { name: meta.name, description: meta.description },
      create: { slug, name: meta.name, description: meta.description, system: true },
    });

    const permissionRows = await prisma.permission.findMany({
      where: { slug: { in: [...permissions] } },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: permissionRows.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
      })),
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
