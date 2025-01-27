import { db } from ".";
import { seed } from "drizzle-seed";
import * as schema from "./schema";

async function main() {
  try {
    await seed(db, schema);

    console.log("Seed complete");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
