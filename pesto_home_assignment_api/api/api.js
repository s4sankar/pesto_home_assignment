const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/taskController');
const authController = require('../controllers/authController');

// TASKS ROUTES
router.get('/get-all-tasks', tasksController.getAllTasks);
router.post('/add-task', tasksController.addTask);
router.patch('/update-task/:id', tasksController.updateTask);
router.delete('/delete-task/:id', tasksController.deleteTask);

// AUTH ROUTES
router.post('/register', authController.addNewUser);
router.post('/login', authController.handleLogin);


module.exports = router;