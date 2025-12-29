const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async ()=>{
   try {
     await mongoose.connect(process.env.MONGODB_URI)
     console.log("Connected to MongoDB...");
     
   } catch (error) {
    console.log("Could not establish a connection", error);
    
    
   }
}

module.exports = connectDB


// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB...");
//   } catch (error) {
//     console.error("❌ Could not establish a MongoDB connection:", error.message);
//     process.exit(1); // Stop the server if database connection fails
//   }
// };

// module.exports = connectDB;



//new
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // 👇 Log actual DB name to verify correct connection
//     console.log(`✅ Connected to MongoDB: ${conn.connection.name}`);
//     console.log(`📍 Host: ${conn.connection.host}`);
//   } catch (error) {
//     console.log("❌ Could not establish a connection:", error.message);
//   }
// };

// module.exports = connectDB;



