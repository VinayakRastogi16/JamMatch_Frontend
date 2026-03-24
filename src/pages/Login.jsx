import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Mail, Music, Guitar, Lock, Eye, EyeOff} from "lucide-react"

import API from '../services/api';


function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <>
            <div className="container-lg">
                <div className="row">
                    <div className="col">
                        <form action=""></form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login