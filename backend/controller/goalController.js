const asyncHandler = require('express-async-handler')

const Goal = require('../model/goalsModel')

// @desc get goals
// @route GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find()

    res.status(200).json(goals)
})

// @desc set goals
// @route POST /api/goals
// gunakan async untuk interaksi ke database mongoose
const setGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text')
    }
    // console.log(req.body);
    const goals = await Goal.create({
        text: req.body.text,
    })

    res.status(200).json(goals)
})

// @desc update goals
// @route PUT /api/goals/id
const updateGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)

    if(!goals) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedGoal)
})

// @desc delete goals
// @route DELETE /api/goals/id
const deleteGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)

    if(!goals) {
        res.status(400)
        throw new Error('Goal not found')
    }

    await goals.remove()

    res.status(200).json({id: req.params.id})
})

module.exports ={
    getGoals, setGoals, updateGoals, deleteGoals
}