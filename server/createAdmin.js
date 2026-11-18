
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function createAdmin() {
  try {
    const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } =
      process.env;

    if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
      throw new Error(
        "Please configure MONGO_URI and ADMIN_* variables in .env"
      );
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.toLowerCase().trim();

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully.");

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

createAdmin();
