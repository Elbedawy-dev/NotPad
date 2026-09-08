const Note = require('../models/Note')

const addNote = async (req, res) => {

    try {
        const {title, body, isPublic} = req.body;

        if(!title || !body) {
            return res.status(400).json({message: 'Please provide all fields'})
        }

        const newNote = await Note.create({
            user: req.user.id,
            title,
            body, 
            isPublic
        })
        return res.status(201).json({message: 'Note added successfully', Note: newNote})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if(!note) {
            return res.status(404).json({message: 'Note not found'})
        }

        if(note.user.toString() !== req.user.id) {
            return res.status(403).json({message: 'Not authorized to update this note'})
        }

        const {title, body, isPublic} = req.body;

        if(!title || !body) {
            return res.status(400).json({message: 'Please provide all fields'})
        }

        note.title = title;
        note.body = body;
        note.isPublic = isPublic;

        await note.save();

        return res.status(200).json({message: 'Note updated successfully', Note: note})

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteNote = async(req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if(!note) {
            return res.status(404).json({message: 'Note not found'})
        }

        if(note.user.toString() !== req.user.id) {
            return res.status(403).json({message: 'Not authorized to delete this note'})
        }

        await note.deleteOne();

        return res.status(200).json({message: 'Note deleted successfully'})

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { addNote, getNotes, updateNote, deleteNote };