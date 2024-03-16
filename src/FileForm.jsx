import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Editor from './Editor';
import "./fileForm.css"

const FileForm = () => {
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('create');
  const [apiData, setApiData] = useState(''); 
  const [sel_card, setSel_card] = useState("flex"); //none
  const [edi_card, setEdi_card] = useState("none"); //block

  const getDocumentdata = async(Title) =>{
    const res = await axios.get(`http://localhost:5000/api/v1/docs/getdoc/${Title}`);
    if(res.status === 200){
        setApiData(res.data);
        setSel_card("none");
        setEdi_card("block");
    }
    else{
        toast.error("An error occurred. Please try again.")
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (fileType === 'create') {
        const res = await axios.post('http://localhost:5000/api/v1/docs/create', { title });
        if(res.status === 201){
            toast.success('File created successfully!');
            getDocumentdata(title);
        }
      } else {
        const res = await axios.post('http://localhost:5000/api/v1/docs/findDoc', { title });
        if(res.status === 200){
            toast.success("Opening File!");
            getDocumentdata(title);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  };

  return (
    <div>
      <div className='form-sel' style={{"display": sel_card }}>
        <div className='contain'>
        <h2>Create/Open File</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                </label>
                <div>
                <input
                    type="radio"
                    id="create"
                    name="fileType"
                    value="create"
                    checked={fileType === 'create'}
                    onChange={() => setFileType('create')}
                />
                <label htmlFor="create">Create File</label>
                </div>
                <div>
                <input
                    type="radio"
                    id="open"
                    name="fileType"
                    value="open"
                    checked={fileType === 'open'}
                    onChange={() => setFileType('open')}
                />
                <label htmlFor="open">Open File</label>
                </div>
                <button type="submit" className='btn'>Submit</button>
            </form>
        </div>
      </div>
      <div className="editor_block" style={{"display": edi_card }}>
        <Editor data={apiData} />
      </div>
    </div>
  );
};

export default FileForm;
