import path from "path";

import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"]
    }
  })
);

process.env.NODE_ENV !== "production" && app.use(morgan("dev"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "..", "public")));

// app.use("/api/v1/auth", AuthRouter);
// app.use("/api/v1/users", UserRouter);

// custom middleware
// app.use(errorCatcher)

app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
});

export { app };