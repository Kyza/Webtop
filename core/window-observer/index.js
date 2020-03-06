(() => {
	const { windowManager } = require("../node-window-manager");
	windowManager.requestAccessibility();
	const { desktopCapturer } = require("electron");

	const makeSafe = (text) => {
		const safeChars = [
			`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 `
		];
		let safeText = text;
		for (let i = 0; i < safeText.length; i++) {
			if (safeChars.indexOf(safeText[i]) < 0) {
				safeText = safeText
					.slice(0, i)
					.concat(safeText.slice(i + 1, safeText.length));
			}
		}
		return safeText;
	};

	const windowsToAvoid = [
		"NVIDIA GeForce Overlay",
		"Webtop Desktop",
		"Drag",
		"Cortana",
		"Start",
		"Jump List for "
	];
	let allWindows = [];

	let callbacks = [];

	setInterval(() => {
		if (callbacks.length > 0) {
			let windowsAdded = [];
			let windowsRemoved = [];

			desktopCapturer
				.getSources({
					types: ["window"],
					thumbnailSize: { width: 512, height: 512 },
					fetchWindowIcons: true
				})
				.then(async (sources) => {
					// Loop over all of the saved windows.
					// Remove all windows that don't exist anymore.
					for (let i = 0; i < allWindows.length; i++) {
						const savedWindow = allWindows[i];
						// If the saved window isn't in the list of windows...
						if (
							!sources.find((source) => {
								if (source.id == savedWindow.desktopCapturer.id) {
									return true;
								}
							})
						) {
							allWindows.splice(i, 1);
							windowsRemoved.push(savedWindow);
						}
					}

					// Loop over all of the desktop window sources.
					// Add all new windows.
					for (let i = 0; i < sources.length; i++) {
						const source = sources[i];

						// Make sure the window isn't one that needs to be avoided.
						if (windowsToAvoid.indexOf(source.name) < 0) {
							// Make sure the window isn't already in the list of windows.
							if (
								!allWindows.find((window) => {
									if (window.desktopCapturer.id == source.id) {
										return true;
									}
								})
							) {
								const windowManagerWindows = windowManager.getWindows();

								// Loop over all of the windows that node-window-manager finds.
								for (let j = 0; j < windowManagerWindows.length; j++) {
									const windowManagerWindow = windowManagerWindows[j];
									// Match the desktop window source with the node-window-manager window.
									if (
										parseInt(source.id.replace("window:", "").replace(":0", "")) ==
										windowManagerWindow.id
									) {
										allWindows.push({
											desktopCapturer: source,
											windowManager: windowManagerWindow
										});
										windowsAdded.push({
											desktopCapturer: source,
											windowManager: windowManagerWindow
										});
									}
								}
							}
						}
					}

					if (windowsAdded.length > 0 || windowsRemoved.length > 0) {
						for (let i = 0; i < callbacks.length; i++) {
							try {
								callbacks[i](allWindows, windowsAdded, windowsRemoved);
							} catch (e) {
								console.error(e);
							}
						}
					}
				});
		}
	}, 1000);

	function remove(array, element) {
		return array.filter((el) => el !== element);
	}

	module.exports = {
		observe: (callback) => {
			callbacks.push(callback);
		},
		unobserve: (callback) => {
			remove(callbacks, callback);
		}
	};
})();
