const Document = require("../../model/document.schema");

const saveDocument = async(title, data) => {
    if(!title || !data){
        return 0;
    }

    try {
        const existingDoc = await Document.findOne({ title });
        if (!existingDoc) {
            return 0;
        }

        existingDoc.content = data;
        const updatedDoc = await existingDoc.save();
        return 1;
    } catch (error) {
        console.error('Error saving document:', error);
        return 0;
    }
}

module.exports = saveDocument;