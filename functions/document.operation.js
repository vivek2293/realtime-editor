const Document = require('../model/document.schema');

const getAllDocument = async (req, res) => {
    try {
        const documents = await Document.find({});
        return res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return res.status(500).json({ error: 'Failed to fetch documents.' });
    }
};

const createDocument = async (req, res) => {
    const { title } = req.body;
    if(!title){
        return res.status(400).json({"error": "Bad request."})
    }

    const exists = await Document.findOne({ title });
    if(exists){
        return res.status(400).json({"error": "File already exists"});
    }

    try{
        const newDoc = await Document.create({title});
        return res.status(201).json(newDoc);
    }
    catch{
        console.error('Error creating document:', error);
        return res.status(500).json({ error: 'Failed to create document.' });
    }
}

const saveDocument = async(req, res) => {
    const { title, data } = req.body;

    if(!title || !data){
        return res.status(400).json({"error" : "Bad request."})
    }

    try {
        const existingDoc = await Document.findOne({ title });
        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        existingDoc.content = data;
        const updatedDoc = await existingDoc.save();
        return res.status(200).json(updatedDoc);
    } catch (error) {
        console.error('Error saving document:', error);
        return res.status(500).json({ error: 'Failed to save document.' });
    }
}

const getDocument = async (req, res) => {
    const { title } = req.params;
    if(!title){
        return res.status(400).json({"error": "Bad request."});
    }

    try{
        const doc = await Document.findOne({ title });
        if(!doc){
            return res.status(404).json({ error: 'Document not found.' });
        }

        return res.status(200).json({ title: doc.title, content: doc.content });
    } catch (error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch document.' });
    }
};

const findDoc = async (req, res) => {
    const { title } = req.body;
    if(!title){
        return res.status(400).json({"error": "Bad request."});
    }

    try{
        const doc = await Document.findOne({ title });
        if(!doc){
            return res.status(404).json({ error: 'No file with this title.' });
        }

        return res.sendStatus(200);
    } catch (error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch document.' });
    }
};

module.exports = { getAllDocument, createDocument, saveDocument, getDocument, findDoc };