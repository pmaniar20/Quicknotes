const Notes = require("../models/Notes")
const ExpressError = require("../utils/ExpressError")

module.exports.fetchAllNotes = async (req, res) => {
    const { id } = req.user
    const notes = await Notes.find({ user: id })
    // return notes in sorted order
    notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    res.status(200).json(notes)
}

module.exports.addNote = async (req, res) => {
    const { id } = req.user
    const { title, description, tag } = req.body
    const notes = new Notes({
        title, description, tag, user: id
    })
    const resp = await notes.save()
    res.status(201).json(resp)
}

module.exports.updateNote = async (req, res) => {
    const { id } = req.params
    const  userId  = req.user.id
    const note = await Notes.findById(id)
    if (!note) {
        // return res.status(400).json({ message: "Note not found !" })
        throw new ExpressError("Note not found", 404)
    }
    if (note.user.toString() !== userId) {
        throw new ExpressError("Unauthorized access", 401)
    }
    const updatedNote = await Notes.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true })
    res.status(201).json(updatedNote)
}

module.exports.deleteNote = async (req, res) => {
    const { id } = req.params
    const  userId  = req.user.id
    const note = await Notes.findById(id)
    if (!note) {
        throw new ExpressError("Note not found", 404)
    }
    if (note.user.toString() !== userId) {
        throw new ExpressError("Unauthorized access", 401)
    }
    const deletedNote = await Notes.findByIdAndDelete(id)
    res.status(201).json({message: `${deletedNote.title} deleted successfully`, note: deletedNote})
}

// module.exports.serchbytag = async (req, res) => {
//     const { id } = req.user
//     const { tag } = req.params
//     const note = await Notes.find({ user: id, tag:{ $regex: tag, $options: 'i' }})
//     // return notes in sorted order
//     if(!note){
//         throw new ExpressError("No notes found", 404)
//     }
//     if(note.user.toString() !== id){
//         throw new ExpressError("Unauthorized access", 401)
//     }
//     note.sort((a, b) => {
//         return new Date(b.updatedAt) - new Date(a.updatedAt)
//     })
//     res.status(200).json(note)
// }

module.exports.search = async (req, res) => {
    const { id } = req.user
    const { search } = req.params
    const notes = await Notes.find({ user: id, $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] })
    // return notes in sorted order
    notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    res.status(200).json(notes)
}

module.exports.searchTag = async (req, res) => {
    const { id } = req.user
    const { tag } = req.params
    const notes = await Notes.find({ user: id, $or: [{ tag: { $regex: tag, $options: 'i' } }] })
    // return notes in sorted order
    notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    res.status(200).json(notes)
}