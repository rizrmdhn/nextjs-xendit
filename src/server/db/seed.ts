import { db } from ".";
import { seed } from "drizzle-seed";
import { items } from "./schema";

async function main() {
  try {
    await seed(db, {
      items,
    }).refine((f) => ({
      items: {
        columns: {
          price: f.int({
            minValue: 100,
            maxValue: 1000,
          }),
        },
      },
    }));

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
