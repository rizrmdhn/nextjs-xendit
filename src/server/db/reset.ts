import { db } from ".";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

async function main() {
  try {
    await reset(db, schema);

    console.log("Reset complete");
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
