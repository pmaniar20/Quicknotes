import React, { useContext, useEffect, } from 'react'
import { NoteContext } from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import empty from '../images/empty.svg'
import { useNavigate } from "react-router-dom";
import { AlertContext } from '../context/AlertContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Notes() {

    const { notes, getNotes } = useContext(NoteContext)
    const navigate = useNavigate()
    const { showAlert } = useContext(AlertContext)
    const [ searchField, setSearchField ] = React.useState('')
    const [ startDate, setStartDate ] = React.useState('')
    const [ endDate, setEndDate ] = React.useState('')
    const [currNotes, setCurrNotes] = React.useState(notes || [])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
            console.log(notes)
            setCurrNotes(notes)
        } else {
            navigate('/about')
            showAlert("You need to signed in first", "error")
        }
        // eslint-disable-next-line
            
    }, [])
    
    useEffect(()=>{
        console.log(notes)
        setCurrNotes(notes)
    }, [notes])

    return (
        <div className="row ps-5 mt-4 mb-1">
            <h1 className="display-6">Your Notes: </h1>
            <Stack spacing={3} direction="row" sx={{ mt: 2 }}>
                <div style={{ display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"row"}}>
                    <TextField id="outlined-basic" label="Search..." variant="outlined"  value={searchField} onChange={(e)=>{
                        setSearchField(e.target.value)
                    }} />
                </div>
                <div style={{ display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"row"}}>
                    Start Date: 
                    <div style={{margin:'10px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={startDate} onChange={(newValue)=> setStartDate(newValue)}  />
                        </LocalizationProvider>
                    </div>
                </div>
                <div style={{ display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"row"}}>
                    End Date: 
                    <div style={{margin:'10px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={endDate} onChange={(newValue)=> setEndDate(newValue)} />
                        </LocalizationProvider>
                    </div>
                </div>
                <div style={{ display:"flex", alignItems:'center', justifyContent:'center', flexDirection:"row"}}>
                    <Button variant="contained" color="secondary" onClick={async ()=>{ 
                        var start_date = ""
                        var end_date = ""
                        if ( startDate.$d && endDate.$d ) {
                            start_date = startDate.$d.toLocaleDateString("default",{year:"numeric"})+"-"+startDate.$d.toLocaleDateString("default",{month:"2-digit"})+"-"+startDate.$d.toLocaleDateString("default",{day:"2-digit"})
                            end_date = endDate.$d.toLocaleDateString("default",{year:"numeric"})+"-"+endDate.$d.toLocaleDateString("default",{month:"2-digit"})+"-"+endDate.$d.toLocaleDateString("default",{day:"2-digit"})
                        }
                        const res = await fetch(`http://localhost:8080/api/notes/search`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "auth-token": localStorage.getItem('token')
                            },
                            body: JSON.stringify({searchField, start_date, end_date})
                        })
                        const data = await res.json()
                        setCurrNotes(data)
                        console.log(data);
                        if (data.length !== 0) {
                            // localStorage.setItem('token', data.token)
                            // getNotes()
                            showAlert("Notes fetched successfully", "success")
                        } else {
                            showAlert("No Notes in given Range", "error")
                        }

                    }}>Search</Button>
                </div>
            </Stack>
            {currNotes.length === 0 && 
            <div className="d-flex ">
                <p style={{position: "absolute", left: "35%", bottom: "-10%"}}>Create your first note :) !</p>
                <img className="img-fluid ms-5 mt-3" src={empty} alt="empty" style={{width: "30%", opacity: "0.5"}} />
            </div>
            }
            {currNotes.map(note => 
                <NoteItem key={note._id} note={note} />
            )}
        </div>
    )
}

export default Notes
