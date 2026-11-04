import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/environment";

async function start(): Promise<void> {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Small Web API listening on http://localhost:${env.PORT}`);
  });
}

start().catch((error: unknown) => {
  console.error("Unable to start the API server.", error);
  process.exitCode = 1;
});
