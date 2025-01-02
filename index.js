import bp from "body-parser";
import cp from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { auth } from "./routes/auth.mjs";
import { tasks } from "./routes/task.mjs";
const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(bp.json());
app.use(cp());
app.use(cors());

const users = new Map();

// secure password, file structure organisation

app.use("/api/auth", auth(users));
app.use("/api/tasks", tasks(users));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
