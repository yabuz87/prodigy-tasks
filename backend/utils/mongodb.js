import mongoose from "mongoose";


async function connect() {
    try {
        if (!process.env.MONGODB_URI) { // Fixed typo here
            throw new Error("MONGODB_URI is not defined in environment variable");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

export default connect;
