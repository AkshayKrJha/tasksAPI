import express from "express";
import cors from "cors";
const app = express();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bp from "body-parser";
import cp from "cookie-parser";
import authenticateToken, {
  checkDuplicateUser,
  checkFilterParams,
  checkPassword,
  checkRegistration,
  checkUser,
} from "./middlewares.mjs";
dotenv.config();
const port = process.env.PORT;
app.use(bp.json());
app.use(cp());
app.use(cors());

const users = new Map();

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
}

app.post(
  "/api/auth/register",
  checkRegistration,
  checkDuplicateUser(users),
  (req, res) => {
    // const payload = req.body;
    console.log("====Request User====", req.user);
    // users.push({ user: payload.user });
    users.set(req.user.userName, {
      tasks: new Map(),
      password: req.user.password,
    });
    // store username and password
    // const token = generateAccessToken(payload);
    res.json({ message: "User registered" });
  }
);

app.post(
  "/api/auth/login",
  checkRegistration,
  checkUser(users),
  checkPassword(users),
  (req, res) => {
    const payload = req.body;
    console.log(payload);
    // if username, password valid, generate jwt
    // and store in cookie
    const token = generateAccessToken(payload);
    res.cookie("accessToken", token, { maxAge: 1000 * 60 * 60 });
    res.json({ message: "Logged in", token });
  }
);

app.post(
  "/api/tasks",
  authenticateToken,
  checkUser(users),
  checkPassword(users),
  (req, res) => {
    // create a task
    const userName = req.user.userName;
    const { description, dueDate } = req.body;
    console.log("<<<<<<<<<<<Authenticated User info>>>>>>>>>", req.user);
    const userTasks = users.get(userName)?.tasks;
    // set some random id
    let mapSize = userTasks?.size;
    let key = mapSize ? +[...userTasks][mapSize - 1][0] + 1 : 0;
    key = `${key}`;
    userTasks.set(key, { description, dueDate });
    res.json({ message: "Task added", tasks: [...userTasks] });
  }
);

app.get(
  "/api/tasks",
  authenticateToken,
  checkUser(users),
  checkPassword(users),
  (req, res) => {
    const userName = req.user.userName;
    console.log("Authenticated User info", req.user);
    const userTasks = users.get(userName)?.tasks;
    console.log("Tasks\t", userTasks);
    res.json({ message: "Tasks found", tasks: [...userTasks] });
    // res.json({
    //   message: "Tasks found",
    //   tasks: [
    //     ...new Map([[1, { description: "sadasd", dueDate: "12 jan 2025" }]]),
    //   ],
    // });
  }
);

app.put(
  "/api/tasks/:id",
  authenticateToken,
  checkUser(users),
  checkPassword(users),
  (req, res) => {
    const userName = req.user.userName;
    const {
      body,
      params: { id },
    } = req;
    const { description, dueDate } = body;
    const userTasks = users.get(userName)?.tasks;
    userTasks.set(id, { description, dueDate });
    res.json({ message: "Task Updated", tasks: [...userTasks] });
  }
);

app.delete(
  "/api/tasks/:id",
  authenticateToken,
  checkUser(users),
  checkPassword(users),
  (req, res) => {
    const userName = req.user.userName;
    const userTasks = users.get(userName)?.tasks;
    const {
      params: { id },
    } = req;
    userTasks.delete(id);
    res.json({ message: "Task deleted", tasks: [...userTasks] });
  }
);

app.get(
  "/api/tasks/filter",
  authenticateToken,
  checkUser(users),
  checkPassword(users),
  checkFilterParams,
  (req, res) => {
    const userName = req.user.userName;
    const { status } = req.query;
    const userTasks = users.get(userName)?.tasks;
    let filteredTasks;
    if (status?.toLowerCase() === "overdue") {
      filteredTasks = new Map(
        [...userTasks].filter(([k, v]) => {
          console.log(
            "Dates",
            v?.dueDate,
            "is belw  ",
            +new Date(v?.dueDate) < +new Date(new Date().toDateString())
          );
          return +new Date(v?.dueDate) < +new Date(new Date().toDateString());
        })
      );
    } else if (status.toLowerCase() === "today") {
      filteredTasks = new Map(
        [...userTasks].filter(([k, v]) => {
          return +new Date(v?.dueDate) == +new Date(new Date().toDateString());
        })
      );
    } else filteredTasks = userTasks;
    res.json({ message: "Filtered tasks found", tasks: [...filteredTasks] });
  }
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
