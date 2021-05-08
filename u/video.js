function video(playbackRate = 1, skipRate = 10) {
	function popup(msg, sec = 2, el = document.querySelector("video").parentElement) {
		if (document.getElementById("_popup_")) {
			document.getElementById("_popup_").remove();	
		}
		let node = document.createElement("h1");
		node.innerText = msg;
		node.setAttribute("style", `
			position: absolute;
			margin: 8px;
			padding: 8px;
			background-color: black;
			color: white;
			z-index: 9999;`);
		node.setAttribute("id", "_popup_");
		el.prepend(node);
		setTimeout(() => {
			node.remove();
		}, sec * 1000);
	}
	if (!document.querySelector("video")) {
		popup("No video found.", 3, document.body);
		return;
	}
	function msToTimeStr(time) {
		let hour = parseInt(time / 3600);
		if (hour < 10) hour = "0" + hour;
		let minute = parseInt((time % 3600) / 60);
		if (minute < 10) minute = "0" + minute;
		let second = parseInt(time % 60);
		if (second < 10) second = "0" + second;
		return `${hour == 0 ? "" : hour + ":"}${minute}:${second}`;
	}
	
	let video = document.querySelector("video");
	video.playbackRate = playbackRate;

	let instructions = `T -> Instructions
						Right arrow -> Fast forward
						Left arrow -> Rewind
						Up arrow -> Speed up
						Down arrow -> Slow down
						Space -> Play/Pause
						S -> Save timestamp
						L -> Load timestamp
						P -> Show time left`;
	
	popup(instructions, 8);
	
	document.onkeydown = e => {
		let url = window.location.href;
		let data = localStorage.getItem("videoLeftOffAt");
		switch (e.keyCode) {
			case 37:
				e.preventDefault();
				video.currentTime = video.currentTime - skipRate;
				popup("<<");
				break;
			case 39:
				e.preventDefault();
				video.currentTime = video.currentTime + skipRate;
				popup(">>");
				break;
			case 32:
				e.preventDefault();
				if (video.paused) {
					video.play();
					popup(">");
				} else {
					video.pause();
					popup("II");
				}
				break;
			case 38:
				e.preventDefault();
				if (video.playbackRate < 16) video.playbackRate += 0.5;
				popup(video.playbackRate);
				break;
			case 40:
				e.preventDefault();
				if (video.playbackRate > 0) video.playbackRate -= 0.5;
				popup(video.playbackRate);
				break;
			case 83:
				e.preventDefault();
				try {
					data = JSON.parse(data);
					if (!data || typeof data != "object") throw new Error();
				} catch (e) {
					data = [];
				}
				let time = video.currentTime;
				let exists = false;
				for (let i of data) {
					if (i.url == url) {
						i.time = time;
						exists = true;
						break;
					}
				}
				if (!exists) {
					let obj = { url, time };
					data.push(obj);
				}
				localStorage.setItem("videoLeftOffAt", JSON.stringify(data));
				popup(`Left off at ${msToTimeStr(time)}`);
				break;
			case 76:
				e.preventDefault();
				try {
					data = JSON.parse(data);
					if (!data || typeof data != "object") throw new Error();
					let time;
					for (let i of data) {
						if (i.url == url) {
							time = i.time;
						}
					}
					video.currentTime = time;
					popup(`Continuing from ${msToTimeStr(time)}`);
				} catch (e) {
					popup("No save found.");
				}
				break;
			case 84:
				popup(instructions, 8);
				break;
			case 80:
				e.preventDefault();
				popup(new Date((video.duration - video.currentTime) * 1000 / video.playbackRate).toUTCString().match(/\d\d:\d\d:\d\d/));
		}
	};
}
video();

// fetch("https://bzgn.me/video").then(r => r.text()).then(t => eval(t));
