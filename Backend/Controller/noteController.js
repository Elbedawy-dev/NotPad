const Note = require('../models/Note')
const cloudinary = require('../config/cloudinary')

const uploadToCloudinary = async (file, folder) => {
    if (!file) return null;
    const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    try {
        const result = await cloudinary.uploader.upload(dataURI, { folder });
        return result.secure_url;
    } catch (err) {
        console.error("Cloudinary upload failed, using data URI fallback:", err.message);
        return dataURI;
    }
};

const addNote = async (req, res) => {
    try {
        const { title, body, isPublic, image } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: 'Please provide all fields' })
        }

        let imageUrl = image || null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file, "notpad_notes")
        }

        const newNote = await Note.create({
            user: req.user.id,
            title,
            body,
            isPublic: isPublic === true || isPublic === "true",
            image: imageUrl
        })
        return res.status(201).json({ message: 'Note added successfully', Note: newNote })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this note' })
        }

        const { title, body, isPublic, image } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: 'Please provide all fields' })
        }

        note.title = title;
        note.body = body;
        note.isPublic = isPublic === true || isPublic === "true";
        if (image !== undefined) {
            note.image = image;
        }

        if (req.file) {
            note.image = await uploadToCloudinary(req.file, "notpad_notes")
        }

        await note.save();

        return res.status(200).json({ message: 'Note updated successfully', Note: note })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const togglePin = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        note.isPinned = !note.isPinned
        await note.save();

        return res.status(200).json({ message: note.isPinned ? 'Note pinned' : 'Note unpinned', note })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this note' })
        }

        await note.deleteOne();

        return res.status(200).json({ message: 'Note deleted successfully' })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const uploadNoteImage = async (req, res) => {
    try {
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) resolve(result)
                        else reject(error)
                    }
                )
                stream.end(req.file.buffer)
            })
        }

        const result = await streamUpload()

        const note = await Note.findById(req.params.noteId)

        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }

        note.image = result.secure_url
        await note.save()

        return res.status(200).json({ message: 'Image uploaded successfully', note })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { addNote, getNotes, updateNote, deleteNote, uploadNoteImage, togglePin };

