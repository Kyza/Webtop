const path = require("path");
const { BrowserWindow, globalShortcut } = require("electron");

// Create the browser window.
let win = new BrowserWindow({
	title: "Webtop Desktop",
	frame: false,
	skipTaskbar: true,
	backgroundColor: "#111",
	transparent: true,
	resizable: false,
	closable: false,
	webPreferences: {
		nodeIntegration: true,
		experimentalFeatures: true
	}
});

// and load the index.html of the app.
win.loadFile(path.join(__dirname, "window", "index.html"));

win.maximize();

globalShortcut.register("Super+D", () => {
	win.focus();
});

// Open the DevTools.
win.webContents.openDevTools();

// Emitted when the window is closed.
win.on("closed", () => {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	win = null;
});
