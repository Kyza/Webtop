const path = require("path");

const anime = require("animejs");
const WindowObserver = require("../../../core/window-observer");
const { desktopCapturer } = require("electron");
const remote = require("electron").remote;
const child_process = require("child_process");

var mouseX = 0;
var mouseY = 0;
document.body.onmousemove = (e) => {
	mouseX = e.screenX;
	mouseY = e.screenY;
};

document.querySelector("#open-folder").onclick = () => {
	child_process.exec(`start "" "${require("os").homedir()}"`);
};

document.querySelector("#restore-windows-desktop").onclick = () => {
	remote.app.quit();
};

WindowObserver.observe(async (allWindows, windowsAdded, windowsRemoved) => {
	for (let i = 0; i < windowsRemoved.length; i++) {
		const windowRemoved = windowsRemoved[i];
		try {
			windowRemoved.windowManager.restore();
		} catch (e) {}
		document
			.querySelector(`[window-id="${windowRemoved.desktopCapturer.id}"]`)
			.remove();
	}
	for (let i = 0; i < windowsAdded.length; i++) {
		const windowAdded = windowsAdded[i];

		const floatingWindow = document.createElement("div");

		const video = document.createElement("video");
		floatingWindow.setAttribute("window-id", windowAdded.desktopCapturer.id);
		floatingWindow.className = "window";

		video.srcObject = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: "desktop",
					chromeMediaSourceId: windowAdded.desktopCapturer.id,
					minWidth: 0,
					maxWidth: 512,
					minHeight: 0,
					maxHeight: 512
				}
			}
		});

		video.onloadedmetadata = (e) => {
			video.play();
		};

		video.onclick = () => {
			anime({
				targets: video,
				opacity: 0.5,
				direction: "alternate",
				loop: 2,
				easing: "easeInOutSine",
				duration: 200
			});
		};
		video.onmouseup = () => {
			setTimeout(() => {
				windowAdded.windowManager.show();
				windowAdded.windowManager.bringToTop();
			}, 100);
		};

		const icon = document.createElement("img");
		icon.src = windowAdded.desktopCapturer.appIcon.toDataURL();

		floatingWindow.appendChild(video);

		let moveInterval;

		floatingWindow.onmouseenter = (e) => {
			const calculatePosition = () => {
				let position = mouseX - video.offsetWidth / 2;
				if (
					position + video.offsetWidth >
					document.getElementById("windows").offsetWidth - 50
				)
					position =
						document.getElementById("windows").offsetWidth - video.offsetWidth;
				if (position < 0) position = 0;
				return position;
			};

			anime({
				targets: video,
				translateX: calculatePosition(),
				duration: 1e3
			});
			moveInterval = setInterval(() => {
				anime({
					targets: video,
					translateX: calculatePosition(),
					duration: 1e3
				});
			}, 250);
		};

		floatingWindow.onmouseleave = () => {
			clearInterval(moveInterval);
			anime({
				targets: video,
				translateX: 0
			});
		};

		document.getElementById("windows").appendChild(floatingWindow);
	}
});
