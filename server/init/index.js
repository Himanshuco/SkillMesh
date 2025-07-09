const mongoose = require("mongoose");
const initData = require("./data.js"); 
const User = require("../models/User.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/skillmesh";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await initDB();

    console.log("User initialization complete.");
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

const initDB = async () => {
  await User.deleteMany({}); // Clear existing users

  // Insert all users
  const insertedUsers = await User.insertMany(initData);

  // Log inserted users by username and email
  insertedUsers.forEach(user => {
    console.log(`Inserted user: ${user.username} (${user.email})`);
  });
};

main();


// If you wanted to add a field to all users (like your owner example), you can do this:
  // For users you likely don't want to add an owner, so I’m skipping this step.
  // But example:
  // initData = initData.map(user => ({ ...user, someField: "someValue" }));