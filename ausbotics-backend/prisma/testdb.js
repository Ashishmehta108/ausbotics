
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testDB() {
  try {
    await prisma.$connect();
    console.log("Database connected!");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

testDB();
