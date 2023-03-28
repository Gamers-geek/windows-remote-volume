var socket = io();

let muted = false;
let volume = 0;

const upButton = document.getElementById("volumeUpButton");
const downButton = document.getElementById("volumeDownButton");
const toggleMuteButton = document.getElementById("volumeToggleMute");
const volumeBar = document.getElementById("volumeBar");
const soundValue = document.getElementById("soundValue");
const volumebarPercent = document.getElementById("volumeBarPercent");

upButton.addEventListener("click", function () {
	socket.emit("changeVolume", { type: "up" });
});
downButton.addEventListener("click", function () {
	socket.emit("changeVolume", { type: "down" });
});

toggleMuteButton.addEventListener("click", function () {
	socket.emit("changeVolume", { type: muted ? "unmute" : "mute" });
});

volumeBar.addEventListener("change", function (newVal) {
	socket.emit("changeVolume", { type: "bar", value: newVal.target.value });
});

socket.on("audioVolume", function (data) {
	muted = data.muted || false;
	volume = data.value || 0;
	updatePageValue();
});

function updatePageValue() {
	if (muted == true) {
		toggleMuteButton.children[0].children[0].classList.remove("fa-volume-high");
		toggleMuteButton.children[0].children[0].classList.add("fa-volume-xmark");
	} else {
		toggleMuteButton.children[0].children[0].classList.remove(
			"fa-volume-xmark"
		);
		toggleMuteButton.children[0].children[0].classList.add("fa-volume-high");
	}
	volumeBar.setAttribute("value", volume);
	soundValue.innerText = `${volume}%`;
	volumebarPercent.value = `${volume}%`;

	if (muted) {
		volumeBar.setAttribute("disabled", true);
	} else {
		volumeBar.removeAttribute("disabled");
	}
}
bulmaSlider.attach();
