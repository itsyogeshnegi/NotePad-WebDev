const Note = require("../models/Note");
const {
  isValidObjectId,
  validateNotePayload,
} = require("../services/noteService");

const createNote = async (req, res) => {
  try {
    const validationError = validateNotePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const note = await Note.create({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create note." });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notes." });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch note." });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const validationError = validateNotePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title: req.body.title.trim(),
        content: req.body.content.trim(),
      },
      {
        returnDocument: "after", // ✅ updated
        runValidators: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update note." });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json({ message: "Note deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete note." });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
