const express = require("express");
const app = express();
const server = require('http').createServer(app);
const WebSocket = require("ws");
const connect = require("./connect");
const logger = require("./middleware/logger")
const routes = require("./routes/router");
const cors = require("cors");
const saveDocument = require("./functions/utils/document.utils.js");

require('dotenv').config();
connect(process.env.MONGO_URI);

app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/api/v1", routes);

const wss = new WebSocket.Server({ server: server });
const activeConnections = new Map();

wss.on('connection', function connection(ws, req) {
	const documentId = req.url.split('/').pop();
	console.log(documentId);

	if (!documentId) {
		ws.close();
		return;
	}

	if(!activeConnections.has(documentId)){
		activeConnections.set(documentId, [ws]);
	} 
	else{
		activeConnections.get(documentId).push(ws);
	}
	
	ws.on('message', async (message, isBinary) => {
		const connections = activeConnections.get(documentId);
		connections.forEach((connection) => {
		  if (connection !== ws && connection.readyState === WebSocket.OPEN) {
			connection.send(message, { binary: isBinary });
		  }
		});

		try {
			await saveDocument(documentId, message.toString());
		} catch (error) {
			console.error('Error saving document:', error);
		}
	});

	ws.on('close', () => {
		const connections = activeConnections.get(documentId);
		const index = connections.indexOf(ws);
		if (index !== -1) {
		  connections.splice(index, 1);
		  if (connections.length === 0) {
			activeConnections.delete(documentId);
		  }
		}
	});
})

app.get("/", (req, res) => {
  return res.send("API working");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT)
});
