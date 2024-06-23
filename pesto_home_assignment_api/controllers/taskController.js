const Task = require('../models/Task');
const HttpStatusCode = require('../utils/httpStatusCode');

const addTask = async (req, res) => {
    try {
        const duplicateTask = await Task.findOne({ 'title': req.body['title'] });

        if (duplicateTask && duplicateTask.status !== 'Done') {
            return res.status(HttpStatusCode.CONFLICT).json({ "error": "Task already exists" });
        }

        const result = await Task.create(req.body);
        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Task not created" });
        }

        return res.status(HttpStatusCode.CREATED).json(result);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": error.message });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        if (!tasks) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ "error": "No tasks found" });
        }

        return res.status(HttpStatusCode.OK).json({ "tasks": tasks });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const { id: taskId } = req.params;

        if (!taskId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Task ID is required" });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Update data is required" });
        }

        for (let key in req.body) {
            if (!req.body[key] || req.body[key].length === 0) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": `Value for ${key} is required` });
            }
        }

        const result = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Task not updated" });
        }

        return res.status(HttpStatusCode.OK).json(result);

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id: taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Task not found" });
        }

        const result = await Task.findByIdAndDelete(taskId);

        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ "error": "Task not deleted" });
        }

        return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ "error": error.message });
    }
}

module.exports = {
    addTask,
    getAllTasks,
    updateTask,
    deleteTask
};