const Task = require('../models/Task');
const HttpStatusCode = require('../utils/httpStatusCode');

const addTask = async (req, res) => {
    try {
        const duplicateTask = await Task.findOne({ 'title': req.body['title'] });

        if (duplicateTask && duplicateTask.status !== 'Done') {
            return res.status(HttpStatusCode.CONFLICT).json({ 'message': 'Task already exists' });
        }

        const result = await Task.create({
            'title': req.body['title'],
            'description': req.body['description'],
            'status': req.body['status'],
            'userId': req.userId
        });
        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Task not created' });
        }

        return res.status(HttpStatusCode.CREATED).json(result);
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': error.message });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const pageNumber = req.body['pageNumber'];
        const pageSize = req.body['pageSize'];

        const totalCount = await Task.countDocuments({ userId: req.userId });
        const startIndex = (pageNumber - 1) * pageSize;


        const tasks = await Task.find({ userId: req.userId }, { 'title': 1, 'description': 1, 'status': 1, 'createdAt': 1 })
            .sort({ 'createdAt': -1 })
            .skip(startIndex)
            .limit(pageSize)
            .exec();;

        if (!tasks || tasks.length === 0) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ 'message': 'No tasks found' });
        }

        return res.status(HttpStatusCode.OK).json({ 'totalCount': totalCount, 'tasks': tasks });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': error.message });
    }
}

const getFilteredTasks = async (req, res) => {
    try {
        const status = req.body['status'];
        const pageNumber = req.body['pageNumber'];
        const pageSize = req.body['pageSize'];

        const totalCount = await Task.countDocuments({ userId: req.userId, status: status });
        const startIndex = (pageNumber - 1) * pageSize;

        const tasks = await Task.find({ userId: req.userId, status: status }, { 'title': 1, 'description': 1, 'status': 1, 'createdAt': 1 })
            .sort({ 'createdAt': -1 })
            .skip(startIndex)
            .limit(pageSize)
            .exec();;

        if (!tasks || tasks.length === 0) {
            return res.status(HttpStatusCode.NOT_FOUND).json({ 'message': `No tasks found with status - ${status}` });
        }

        return res.status(HttpStatusCode.OK).json({ 'totalCount': totalCount, 'tasks': tasks });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const { id: taskId } = req.params;

        if (!taskId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Task ID is required' });
        }

        if (!req.body.status) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Status update data is required' });
        }

        const validStatuses = ['Todo', 'InProgress', 'Done'];
        if (!validStatuses.includes(req.body.status)) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Invalid status value' });
        }

        const result = await Task.findByIdAndUpdate(taskId, { 'status': req.body.status }, { new: true });

        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Task not updated' });
        }

        return res.status(HttpStatusCode.OK).json(result);

    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id: taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Task not found' });
        }

        const result = await Task.findByIdAndDelete(taskId);

        if (!result) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ 'message': 'Task not deleted' });
        }

        return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ 'message': error.message });
    }
}

module.exports = {
    addTask,
    getAllTasks,
    getFilteredTasks,
    updateTask,
    deleteTask
};