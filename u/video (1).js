function video(playbackRate = 1, skipRate = 10) {
	let video = document.querySelector("video");
	video.playbackRate = playbackRate;

    function popup(msg, sec = 2) {
        if (document.getElementById("_popup_"))
            document.getElementById("_popup_").remove();
        let node = document.createElement("h1");
        node.innerText = msg;
        node.setAttribute("style",
            "position: absolute;" +
            "margin: 8px;" +
            "padding: 8px;" +
            "background-color: black;"+
            "color: white;");
        node.setAttribute("id", "_popup_");
        video.parentElement.appendChild(node);
        setTimeout(() => {
            node.remove();
        }, sec * 1000);
    }
	
	popup("Right arrow -> Fast forward\nLeft arrow -> Rewind\nUp arrow -> Speed up\nDown arrow -> Slow down\nSpace -> Play/Pause\nF -> Fullscreen on/off", 5);
	
	document.onkeydown = event => {
		switch (event.keyCode) {
			case 37:
				event.preventDefault();
				video.currentTime = video.currentTime - skipRate;
				popup("<<");
				break;
			case 39:
				event.preventDefault();
				video.currentTime = video.currentTime + skipRate;
				popup(">>");
				break;
			case 32:
				event.preventDefault();
				if (video.paused) {
					video.play();
				    popup(">");
				} else {
					video.pause();
				    popup("II");
				}
				break;
			case 70:
				event.preventDefault();
				if (document.fullscreen) {
					document.exitFullscreen();
				} else {
					video.requestFullscreen();
				}
				popup("F");
				break;
			case 38:
				event.preventDefault();
				video.playbackRate += 0.5;
				popup(video.playbackRate);
				break;
			case 40:
				event.preventDefault();
				video.playbackRate -= 0.5;
				popup(video.playbackRate);
				break;
		}
	};
}
video();

// fetch("https://bzgn.me/video").then(r => r.text()).then(t => eval(t));