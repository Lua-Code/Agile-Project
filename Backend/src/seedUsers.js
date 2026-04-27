import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const users = [
  {
    fullName: "Ali Hatem",
    email: "ali.tahssin@gmail.com",
    password: "13030555a",
    role: "student",
  },
  {
    fullName: "Kevin David",
    email: "lua-code@gmail.com",
    password: "1234567890",
    role: "professor",
  },
  {
    fullName: "Zeyad Abdelmageed",
    email: "zeko@gmail.com",
    password: "meligy3ars",
    role: "admin",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const { fullName, email, password, role } of users) {
    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`Skipped (already exists): ${email}`);
      continue;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, passwordHash, role });
    console.log(`Created: ${email}`);
  }

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
