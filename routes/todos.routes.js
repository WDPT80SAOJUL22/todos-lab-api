const { Router } = require('express');
const Todo = require('../models/Todo.js');
const User = require('../models/User.js');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user.id
        const allTodos = await Todo.find({user: userId});
        res.status(200).json(allTodos)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

router.post('/', async (req, res) => {
    const {title, completed} = req.body
    try {
        const userId = req.user.id
        const newTodo = await Todo.create({...req.body, user: userId});
        await User.findByIdAndUpdate(userId, { $push: {todos: newTodo._id}})
        res.status(201).json(newTodo)
    } catch (error) {
        res.status(400).json({msg:`Couldn't create a new Todo`, error})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id
    const {title, completed} = req.body
    try {
        const updatedTodo = await Todo.findOneAndUpdate({_id: id, user: userId}, req.body, {
            new: true
        });
        if (!updatedTodo) {
            const error = new Error('Can not uptade todo from another user')
            throw error
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({msg:`Can't uptade Todo`, error})
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const todo = await Todo.findById(id)
        console.log(userId, todo.user)
        if (todo.user.toString() !== userId) {
            const error = new Error('Can not delete todo from another user')
            throw error 
        }
        todo.delete();
        res.status(202).json('Todo was deleted')
    } catch (error) {
        res.status(500).json({msg:`Can not delete Todo`, error})
    }
})

module.exports = router
