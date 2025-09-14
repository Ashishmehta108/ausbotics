const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🔹 Starting seed script...");

  const passwordHash = await bcrypt.hash("password123", 10);
  console.log("✅ Password hashed");

  console.log("👉 Upserting users...");
  const users = [
    { email: "superadmin@example.com", role: "SUPERADMIN" },
    { email: "admin@example.com", role: "ADMIN" },
    { email: "user@example.com", role: "USER" },
  ];

  for (const user of users) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: passwordHash,
        role: user.role,
      },
    });
    console.log(`✅ Upserted user: ${upsertedUser.email}`);
  }

  console.log("👉 Upserting workflows...");
  const workflows = [
    {
      name: "Sample Workflow 1",
      description: "This is the first sample workflow",
      status: "New",
      progress: 0,
    },
    {
      name: "Sample Workflow 2",
      description: "This is the second sample workflow",
      status: "New",
      progress: 0,
    },
  ];

  for (const workflow of workflows) {
    const upsertedWorkflow = await prisma.workflow.upsert({
      where: { name: workflow.name },
      update: {},
      create: {
        name: workflow.name,
        description: workflow.description,
        status: workflow.status,
        progress: workflow.progress,
        subscribedUser: {
          connect: { email: "user@example.com" },
        },
      },
    });
    console.log(`✅ Upserted workflow: ${upsertedWorkflow.name}`);
  }

  console.log("👉 Upserting execution results...");
  const executionResult = await prisma.executionResult.upsert({
    where: { id: "result-1" },
    update: {},
    create: {
      id: "result-1",
      workflow: {
        connect: { name: "Sample Workflow 1" },
      },
      status: "None",
      totalCalls: 0,
    },
  });
  console.log(`✅ Upserted execution result: ${executionResult.id}`);
}

main()
  .then(async () => {
    console.log("🎉 Seeding completed successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
