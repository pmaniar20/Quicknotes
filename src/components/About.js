import React from 'react'
import Navbar from "./Navbar";
import '../styles/about.css';
import login from '../images/quicknotes.webp'
import awesome from '../images/images.jpeg'
import { Link } from "react-router-dom";
import { Button } from '@mui/material';
import Alertss from "./Alertss";

function About() {
    return (
        <div>
            <Navbar />
            <Alertss />
            <div className="text-white aboutImg text-center">
                <div className="note-img">
                    <h1 className="display-4">Empowering  Students</h1>
                    <p>An online web platform where you can create, edit, upload, delete your notes privately and securely without any disturbancee</p>
                </div>
            </div>

            <div className="container mt-5 ">
                <div className="row">
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h2 className="mb-3" style={{ fontWeight: "Bold" }}> PLAN. <span style={{ color: "#9C27B0" }}>NOTE. </span> EXECUTE.</h2>
                        <p>Quick Notes is made from the pain of writing all the things in notebook which is very hectic, so we made an online web platform where you can create, edit, upload, delete your notes privately and securely without any disturbance.
                            You can also access your notes anywhere in your world, at anytime time.
                        </p>
                        <div className="d-flex justify-content-center mt-3">
                            <Button component={Link} to="/new" variant="contained" color="secondary" style={{ color: "White", textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.3rem" }}>Create New Note</Button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <img className="img-fluid awesome" src={awesome} alt="about-awesome" />
                    </div>
                </div>

                <div className="row login mt-5 mb-5 p-5">
                    <div className="col-md-6">
                        <img className="img-fluid" src={login} alt="about-awesome" />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h2 className="mb-3" style={{ fontWeight: "Bold" }}>Powering the <span style={{ color: "#9C27B0" }}>internet’s visuals</span> </h2>
                        <p>
                            How we started? The concept was simple. Quick Notes was born from the pain of writing all the things in notebook which is very hectic :( .
                            An online web platform where you can create, edit, upload, delete your notes privately and securely without any disturbancee
                        </p>
                        <div className="d-flex justify-content-center mt-3">
                            <Button component={Link} to="/register" variant="contained" color="secondary" style={{ color: "White", textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.3rem" }}>Sign up now</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About
