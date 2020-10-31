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
						F -> Fullscreen on/off
						S -> Save timestamp
						L -> Load timestamp`;
	
	popup(instructions, 8);
	
	document.onkeydown = e => {
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
			case 70:
				e.preventDefault();
				if (document.fullscreen) {
					document.exitFullscreen();
				} else {
					video.requestFullscreen();
				}
				popup("F");
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
				let time = video.currentTime;
				localStorage.setItem("videoLeftOffAt", time);
				popup(`Left off at ${msToTimeStr(time)}`);
				break;
			case 76:
				e.preventDefault();
				if (localStorage.getItem("videoLeftOffAt")) {
					let time = localStorage.getItem("videoLeftOffAt");
					video.currentTime = time;
					popup(`Continuing from ${msToTimeStr(time)}`);
				} else {
					popup("No save found.");
				}
				break;
			case 84:
				popup(instructions, 8);
				break;
		}
	};
}
video();

// fetch("https://bzgn.me/video").then(r => r.text()).then(t => eval(t));
