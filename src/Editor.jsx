import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import "./editor.css"

function Editor(props) {
    console.log(props)
    const [ws, setWs] = useState(null);
    const [text, setText] = useState("");
    const [file, setFile] = useState("No File Opened")

    useEffect(() => {
        if(props.data.title){
            const socket = new WebSocket(`ws://localhost:5000/${props.data.title}`);
            setWs(socket);

            socket.onopen = () => {
                toast.success("Websocket connected");
            };

            socket.onclose = () => {
                toast.success("Websocket closed");
            }

            socket.onmessage = (event) => {
                setText(event.data);
            };

            socket.onerror = () => {
                toast.error("WebSocket error");
            };
        }  
    }, [props.data.title]);

    useEffect(() => {
        if(props.data.content) setText(props.data.content);
        if(props.data.title) setFile(props.data.title);
    }, [props])

    const handleChange = (event) => {
        const { value } = event.target;

        if (ws) {
            ws.send(value);
            setText(value);
        }
        else{
            toast.error("Connection failed!")
        }
    };

    const clear = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/docs/save', {
                title: props.data.title,
                data: text
            });

            if(res.status === 200){
                toast.success("Document saved.");
                if(ws){
                    ws.close();
                    setText("");
                    setWs(null);
                    setFile("No File Opened");
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
                else{
                    toast.error("Connection already closed!");
                }
            }
        } 
        catch(error){
            console.error('Error saving document:', error);
            toast.error("Error saving document.");
        }

       
    };
    
  return (
    <React.Fragment>
      <h1>Realtime Collaborative Editor</h1>
      <h6>{ file }</h6>
      <div className='container'>
        <textarea className='area'
        value={text} onChange={handleChange}>
        </textarea>
      <button onClick={clear}>Save and close connection</button>
      </div>
    </React.Fragment>
  )
}

export default Editor