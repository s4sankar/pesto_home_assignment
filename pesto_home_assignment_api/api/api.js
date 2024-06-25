const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const tasksController = require('../controllers/taskController');
const authController = require('../controllers/authController');

// TASKS ROUTES
router.post('/get-tasks', verifyJWT, tasksController.getAllTasks);
router.post('/get-filtered-tasks', verifyJWT, tasksController.getFilteredTasks);
router.post('/add-task', verifyJWT, tasksController.addTask);
router.patch('/update-task/:id', verifyJWT, tasksController.updateTask);
router.delete('/delete-task/:id', verifyJWT, tasksController.deleteTask);

// AUTH ROUTES
router.post('/register', authController.addNewUser);
router.post('/login', authController.handleLogin);
router.get('/refresh', authController.handleRefreshToken);
router.get('/logout', authController.handleLogout);


module.exports = router;