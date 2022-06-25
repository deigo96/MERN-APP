const asyncHandler = require('express-async-handler')

// @desc get goals
// @route GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'get goals'})
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

    res.status(200).json({message: 'Set goals'})
})

// @desc update goals
// @route PUT /api/goals/id
const updateGoals = asyncHandler(async (req, res) => {
    res.status(200).json({message: `update goal ${req.params.id}`})
})

// @desc delete goals
// @route DELETE /api/goals/id
const deleteGoals = asyncHandler(async (req, res) => {
    res.status(200).json({message: `delete goal ${req.params.id}`})
})

module.exports ={
    getGoals, setGoals, updateGoals, deleteGoals
}