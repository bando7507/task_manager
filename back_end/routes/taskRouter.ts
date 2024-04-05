import { Router } from "express";
import {
  createTaskList,
  getAllTasks,
  getSingleTasks,
  updateTask,
} from "../controllers/taskController";
import { authenticateUser } from "../controllers/userController";

const router = Router();

router.get("/api/v01/tasks", authenticateUser, getAllTasks);
router.get("/api/v01/tasks/:id", authenticateUser, getSingleTasks);
router.post("/api/v01/postTasks", createTaskList);
router.put("/api/v01/putTasks", updateTask);

export default router;
