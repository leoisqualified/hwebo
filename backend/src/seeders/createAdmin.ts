// scripts/createAdmin.ts
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../src/config/db";
import { User } from "../../src/models/User";

const createAdmin = async () => {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const adminEmail = "admin@example.com";
  const plainPassword = "AdminPassword123"; // Use a strong password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingAdmin = await userRepo.findOneBy({ email: adminEmail });
  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const adminUser = userRepo.create({
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    verified: true,
  });

  await userRepo.save(adminUser);
  console.log("Admin user created successfully.");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${plainPassword}`);

  process.exit(0);
};

createAdmin().catch((err) => {
  console.error("Error creating admin user:", err);
  process.exit(1);
});
