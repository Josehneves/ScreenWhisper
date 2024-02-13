import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

async function main() {
  dotenv.config();
  const client = new mongodb.MongoClient(process.env.SCREENWHISPER_DB_URI);
  const port = process.env.PORT || 8000;

  try {
    await client.connect();
    app.listen(port, () => {
      console.info(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main().catch(console.error);