const protect = require('../middleware/protect')    
const {addNote, getNotes, updateNote, deleteNote} = require('../Controller/noteController')
const express = require('express')   
const router = express.Router()


router.post('/', protect, addNote)
router.get('/', protect, getNotes)
router.put('/:noteId', protect, updateNote)
router.delete('/:noteId', protect, deleteNote)

module.exports = router