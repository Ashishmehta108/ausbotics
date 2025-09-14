const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🔹 Starting seed script...");

  // Hash password
  const passwordHash = await bcrypt.hash("password123", 10);
  console.log("✅ Password hashed");

  // --- Users ---
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

  // --- Workflows ---
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
        googleSheet: "https://docs.google.com/spreadsheets/d/your-sheet-id/edit",
        subscribedUser: {
          connect: { email: "user@example.com" },
        },

      },
    });
    console.log(`✅ Upserted workflow: ${upsertedWorkflow.name}`);
  }

  // --- Execution Results ---
  console.log("👉 Upserting execution results...");
  const workflow1 = await prisma.workflow.findUnique({
    where: { name: "Sample Workflow 1" },
  });

  if (workflow1) {
    const executionResult = await prisma.executionResult.upsert({
      where: { workflowId: workflow1.id }, // workflowId is unique
      update: {},
      create: {
        workflowId: workflow1.id,
        status: "None",
        totalCalls: 0,
      },
    });
    console.log(`✅ Upserted execution result for workflow: ${workflow1.name}`);

    console.log("👉 Creating workflow execution...");
    const user = await prisma.user.findUnique({
      where: { email: "user@example.com" },
    });

    if (user) {
      const workflowExecution = await prisma.workflowExecution.upsert({
        where: { id: "exec-1" },
        update: {},
        create: {
          id: "exec-1",
          workflowId: workflow1.id,
          executionId: executionResult.id,
          userId: user.id,
          status: "None",
          progress: 0,
        },
      });
      console.log(`✅ Created workflow execution: ${workflowExecution.id}`);
    }
  }
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
