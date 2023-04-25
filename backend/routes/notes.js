const express = require("express");
const {fetchAllNotes, addNote, updateNote, deleteNote, search, searchTag, findnotesbetweentwodates} = require("../controllers/notes")
const {fetchUser, validateNewNote} = require("../middlewares")
const catchAsync = require("../utils/catchAsync")

const router = express.Router()

// Get all the notes using : GET /api/notes/
router.get('/', fetchUser, catchAsync(fetchAllNotes))

// Post all the notes using : POST /api/notes/
router.post('/', fetchUser, validateNewNote, catchAsync(addNote))

// Update the notes using: PUT /api/notes
router.put('/:id', fetchUser, validateNewNote, catchAsync(updateNote))

// Delete the notes using: PUT /api/notes
router.delete('/:id', fetchUser, catchAsync(deleteNote))

//search
router.post('/search', fetchUser, catchAsync(search))

// search by tag
router.get('/search/tag/:tag', fetchUser, catchAsync(searchTag))

//notes between dates
router.get('/search/date/', fetchUser, catchAsync(findnotesbetweentwodates))

module.exports = router