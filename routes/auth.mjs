import { Router } from "express";
import {
  checkDuplicateUser,
  checkPassword,
  checkRegistration,
  checkUser,
  configurePassword,
} from "../middlewares.mjs";
import { login, register } from "../functions/authUtils.mjs";

const authRouter = Router();

export function auth(users) {
  authRouter.post(
    "/login",
    checkRegistration,
    checkUser(users),
    checkPassword(users),
    login
  );
  authRouter.post(
    "/register",
    checkRegistration,
    checkDuplicateUser(users),
    configurePassword,
    register(users)
  );
  return authRouter;
}
