import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/environment";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { historyRoutes } from "./routes/history.routes";
import { navigationRoutes } from "./routes/navigation.routes";
import { personRoutes } from "./routes/person.routes";
import { searchRoutes } from "./routes/search.routes";
import { siteRoutes } from "./routes/site.routes";

export const app = express();

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"]
    }
  }
}));
app.use(cors({ origin: env.FRONTEND_URL, methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "220kb" }));
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/people", personRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/navigation", navigationRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
