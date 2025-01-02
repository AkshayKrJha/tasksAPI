import { Router } from "express";
import {
  createTask,
  deleteTask,
  filterTasks,
  readTask,
  updateTask,
} from "../functions/taskUtils.mjs";
import authenticateToken, {
  checkFilterParams,
  checkPassword,
  checkUser,
} from "../middlewares.mjs";

const taskRouter = Router();

export function tasks(users) {
  taskRouter.post(
    "/",
    authenticateToken,
    checkUser(users),
    // checkPassword(users),
    createTask(users)
  );
  taskRouter.get(
    "/",
    authenticateToken,
    checkUser(users),
    // checkPassword(users),
    readTask(users)
  );
  taskRouter.put(
    "/:id",
    authenticateToken,
    checkUser(users),
    // checkPassword(users),
    updateTask(users)
  );
  taskRouter.delete(
    "/:id",
    authenticateToken,
    checkUser(users),
    // checkPassword(users),
    deleteTask(users)
  );
  taskRouter.get(
    "/filter",
    authenticateToken,
    checkUser(users),
    // checkPassword(users),
    checkFilterParams,
    filterTasks(users)
  );
  return taskRouter;
}
