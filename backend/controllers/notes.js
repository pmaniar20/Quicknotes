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
    const { searchField, start_date, end_date } = req.body
    var notes = await Notes.find({ user: id})
    if(searchField === ""){
        if(start_date === "" && end_date === ""){
            notes = await Notes.find({ user: id })
        }
        else{
            if(start_date !== "" && end_date !== ""){
                notes = await Notes.find({ user: id, $or: [{ createdAt: { $gte: start_date, $lte: end_date } }, { updatedAt: { $gte: start_date, $lte: end_date } }] })
            }
            else if(start_date !== "" && end_date === ""){
                notes = await Notes.find({ user: id, $or: [{ createdAt: { $gte: start_date } }, { updatedAt: { $gte: start_date } }] })
            }
            else if(start_date === "" && end_date !== ""){
                notes = await Notes.find({ user: id, $or: [{ createdAt: { $lte: end_date } }, { updatedAt: { $lte: end_date } }] })
            }
        }
    }
    else{
        if(start_date === "" && end_date === ""){
            notes = await Notes.find({ user: id, $or: [{ title: { $regex: searchField, $options: 'i' } }, { description: { $regex: searchField, $options: 'i' } }] })
        }
        else{
            if(start_date !== "" && end_date !== ""){
                notes = await Notes.find({ user: id, $or: [{ title: { $regex: searchField, $options: 'i' } }, { description: { $regex: searchField, $options: 'i' }}, { createdAt: { $gte: start_date, $lte: end_date } }, { updatedAt: { $gte: start_date, $lte: end_date } }] })
            }
            else if(start_date !== "" && end_date === ""){
                notes = await Notes.find({ user: id, $or: [{ title: { $regex: searchField, $options: 'i' } }, { description: { $regex: searchField, $options: 'i' }}, { createdAt: { $gte: start_date } }, { updatedAt: { $gte: start_date } }] })
            }
            else if(start_date === "" && end_date !== ""){
                notes = await Notes.find({ user: id, $or: [{ title: { $regex: searchField, $options: 'i' } }, { description: { $regex: searchField, $options: 'i' }}, { createdAt: { $lte: end_date } }, { updatedAt: { $lte: end_date } }] })
            }
        }
    }
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
    
    notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    res.status(200).json(notes)
}

module.exports.findnotesbetweentwodates = async (req, res) => {
    const { id } = req.user
    const { start, end } = req.body
    const start_date = new Date(start)
    const end_date = new Date(end)
    console.log(start_date, end_date)
    const notes = await Notes.find({ user: id, $or: [{ createdAt: { $gte: start_date.toISOString() , $lte: end_date.toISOString() } }, { updatedAt: { $gte: start_date.toISOString(), $lte: end_date.toISOString() } }] })
    
    notes.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
    )
    res.status(200).json(notes)

}

