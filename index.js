const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const audio = require("win-audio");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("changeVolume", (data) => {
		let soundValue = audio.speaker.get();
		switch (data.type) {
			case "up":
				audio.speaker.increase(2);
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue });
				break;
			case "down":
				audio.speaker.decrease(2);
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue });
				break;
		}
	});
});
