import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "./functions/otherUtils.mjs";
dotenv.config();
export default function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1] || "";
  // const token = req.cookies["accessToken"];
  console.log("=====token from request====\t", token);
  if (!token) {
    return res.status(401).json({ errorMessage: "User not authenticated" });
  }
  try {
    const user = jwt.verify(token, process.env.SECRET);
    // res.status(200).json({ data: user });
    req.user = user;
    next();
  } catch (e) {
    console.log("Error", e.message);
    return res
      .status(401)
      .json({ errorMessage: "User not authenticated", error: e });
  }
}

export function checkRegistration(req, res, next) {
  const requestedUser = req.body;
  if (!requestedUser || !requestedUser?.userName || !requestedUser?.password) {
    return res.status(400).json({
      errorMessage:
        "Bad request. Required userName and password in json format",
    });
    // throw new Error("Bad request. Required userName in json format");
  }
  req.user = requestedUser;
  next();
}

export function checkUser(users) {
  return function (req, res, next) {
    const user = req.user.userName;
    console.log("====Provided user====\t", user, "\nAvailable\t", users);
    if (!users.get(user)) {
      console.log("===User not exist===");
      return res.status(400).json({
        errorMessage: "User not registered",
      });
    }
    next();
  };
}

export function checkPassword(users) {
  return async function (req, res, next) {
    const user = req.user.userName;
    const password = req.user.password;
    const userPassword = users.get(user).password;
    // console.log("====Provided user====\t", user, "\nAvailable\t", users);
    const match = await verifyPassword(password, userPassword);
    if (!match) {
      console.log("Incorrect Password");
      return res.status(400).json({
        errorMessage: "Incorrect Password",
      });
    }
    next();
  };
}

export async function configurePassword(req, res, next) {
  const password = req.user.password;
  const hashedValue = await hashPassword(password);
  if (!hashedValue) {
    console.log("Error in registering Password");
    return res.status(400).json({
      errorMessage: "Error in registering Password",
    });
  }
  req.user.password = hashedValue;
  next();
}

export function checkDuplicateUser(users) {
  return function (req, res, next) {
    const user = req.user.userName;
    console.log("====Provided user====\t", user, "\nAvailable\t", users);
    if (users.get(user)) {
      console.log("===Duplicate user===");
      return res.status(400).json({
        errorMessage: "User already registered. Try other userName, or login",
      });
    }
    next();
  };
}

export function checkFilterParams(req, res, next) {
  const { status } = req.query;
  if (
    !status ||
    (status?.toLowerCase() !== "overdue" && status?.toLowerCase() !== "today")
  ) {
    return res.status(400).json({
      errorMessage:
        "status required as query parameter to be today, or overdue",
    });
  }
  next();
}
