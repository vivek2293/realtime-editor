const express = require("express");
const router = express.Router();

const {
    getAllDocument,
    createDocument,
    saveDocument,
    getDocument,
    findDoc
} = require("../functions/document.operation");

router.get("/docs", getAllDocument);
router.post("/docs/create", createDocument);
router.post("/docs/save", saveDocument);
router.get("/docs/getdoc/:title", getDocument);
router.post("/docs/findDoc", findDoc)

module.exports = router;