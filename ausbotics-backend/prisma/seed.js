const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    { email: "superadmin@example.com", role: "SUPERADMIN" },
    { email: "admin@example.com", role: "ADMIN" },
    { email: "user@example.com", role: "USER" },
  ];  

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, password: passwordHash, role: u.role },
    });
  }

  const workflows = [
    { name: "Sample Workflow 1", description: "This is the first sample workflow", n8nId: "n8n_workflow_1" },
    { name: "Sample Workflow 2", description: "This is the second sample workflow", n8nId: "n8n_workflow_2" },
  ];

  for (const w of workflows) {
    await prisma.workflow.upsert({
      where: { name: w.name },
      update: {},
      create: w,
    });
  }

  const user = await prisma.user.findUnique({ where: { email: "user@example.com" } });
  const workflow1 = await prisma.workflow.findUnique({ where: { name: "Sample Workflow 1" } });
  const workflow2 = await prisma.workflow.findUnique({ where: { name: "Sample Workflow 2" } });

  const results = [
    {
      workflowId: workflow1.id,
      userId: user.id,
      data: { lead: "John Doe", status: "new", agentMessages: ["Hello!"], callbackBooked: false },
    },
    {
      workflowId: workflow2.id,
      userId: user.id,
      data: { lead: "Jane Doe", status: "contacted", agentMessages: ["Hi!"], callbackBooked: true },
    },
  ];

  for (const r of results) {
    const exists = await prisma.result.findFirst({
      where: { workflowId: r.workflowId, userId: r.userId },
    });
    if (!exists) {
      await prisma.result.create({
        data: {
          workflowId: r.workflowId,
          userId: r.userId,
          data: JSON.stringify(r.data),
          agentMessages: JSON.stringify(r.data.agentMessages),
          callbackBooked: r.data.callbackBooked,
          leadName: r.data.lead,
        },
      });
    }
  }

  console.log("Seed data checked/created successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
