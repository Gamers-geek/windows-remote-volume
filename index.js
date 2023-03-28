const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const audio = require("win-audio");
const { lookup } = require("dns");
const { hostname } = require("os");

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
	lookup(hostname(), function (err, add, fam) {
		console.log(`listening on http://${add}:3000`);
	});
});

io.on("connection", (socket) => {
	console.log("a user connected");
	io.emit("audioVolume", {
		value: audio.speaker.get(),
		muted: audio.speaker.isMuted(),
	});
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("changeVolume", (data) => {
		let soundValue = audio.speaker.get();
		switch (data.type) {
			case "up":
				audio.speaker.set(soundValue + 2);
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue });
				break;
			case "down":
				audio.speaker.set(soundValue - 2);
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue });
				break;
			case "mute":
				audio.speaker.mute();
				io.emit("audioVolume", { value: 0, muted: true });
				break;
			case "unmute":
				audio.speaker.unmute();
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue, muted: false });
				break;
			case "bar":
				audio.speaker.set(parseInt(data.value));
				soundValue = audio.speaker.get();
				io.emit("audioVolume", { value: soundValue });
				break;
		}
	});
	audio.speaker.events.on("change", (volume) => {
		io.emit("audioVolume", {
			value: volume.new,
			muted: audio.speaker.isMuted(),
		});
	});

	audio.speaker.events.on("toggle", (status) => {
		soundValue = audio.speaker.get();
		io.emit("audioVolume", { type: soundValue, muted: status.new });
	});
});
