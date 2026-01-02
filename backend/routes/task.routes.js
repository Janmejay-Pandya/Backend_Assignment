import express from "express";
import { auth } from "../middleware/auth.js";
import { allowRole } from "../middleware/role.js";
import { createTask, getTasks, getTask, updateTask, deleteTask, getAllTasks } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.get("/all", auth, allowRole("admin"), getAllTasks); // Must come before /:id route
router.get("/:id", auth, getTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, allowRole("admin"), deleteTask);


export default router;
