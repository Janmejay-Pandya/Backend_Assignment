import Task from "../models/Task.js";
import { redis } from "../config/redis.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id
    });

    await redis.del(`tasks:${req.user._id}`);
    await redis.del("tasks:all");

    res.json({ message: "Task created", task });
  } catch (err) {
    // Handle duplicate key errors (usually from leftover indexes)
    if (err.code === 11000) {
      return res.status(500).json({ 
        message: "Database index error. Please restart the server to fix this issue.",
        error: "Duplicate key error - this is usually caused by a leftover database index"
      });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const cacheKey = `tasks:${req.user._id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        cached: true,
        tasks: JSON.parse(cached)
      });
    }

    const tasks = await Task.find({ user: req.user._id });

    await redis.set(cacheKey, JSON.stringify(tasks), "EX", 60);

    res.json({ cached: false, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if(!task){
            return res.status(404).json({message:"Task not Found"});
        }
        res.json({ task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not Found" });
        }
        
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // Clear relevant caches
        await redis.del(`tasks:${req.user._id}`);
        await redis.del("tasks:all");
        
        res.json({ task: updatedTask });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        // Admin can delete any task, regular users can only delete their own
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not Found" });
        }
        
        // If user is not admin, check if task belongs to them
        if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this task" });
        }
        
        await Task.findByIdAndDelete(req.params.id);
        
        // Clear relevant caches
        await redis.del(`tasks:${task.user}`);
        await redis.del("tasks:all");
        
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllTasks = async (req, res) => {
  try {
    const cacheKey = "tasks:all";

    const cached = await redis.get(cacheKey);
    if (cached) return res.json({ cached: true, tasks: JSON.parse(cached) });

    const tasks = await Task.find().populate("user", "name email role");

    await redis.set(cacheKey, JSON.stringify(tasks), "EX", 60);

    res.json({ cached: false, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

