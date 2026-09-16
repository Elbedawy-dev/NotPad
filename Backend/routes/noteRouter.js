const protect = require('../middleware/protect')    
const upload = require('../middleware/upload')   
const {addNote, getNotes, updateNote, deleteNote, uploadNoteImage, togglePin} = require('../Controller/noteController')
const express = require('express')   
const router = express.Router()


router.post('/', protect, addNote)
router.get('/', protect, getNotes)
router.put('/:noteId', protect, updateNote)
router.delete('/:noteId', protect, deleteNote)
router.post('/:noteId/image', protect, upload.single('image'), uploadNoteImage)
router.patch('/:noteId/pin', protect, togglePin)
module.exports = router