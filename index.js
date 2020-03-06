// var tasklist = require("tasklist");

// (async () => {
// 	let noWindowTitles = ["N/A", "Nicht zutreffend"];
// 	let processes = await tasklist({ verbose: true });
// 	for (let i = 0; i < processes.length; i++) {
// 		let processData = processes[i];
// 		if (
// 			processData.status.toLowerCase() == "running" &&
// 			processData.imageName.endsWith(".exe") &&
// 			!noWindowTitles.includes(processData.windowTitle)
// 		) {
// 			console.log(processData);
// 		}
// 	}
// 	/*
// 	[{
// 		imageName: 'taskhostex.exe',
// 		pid: 1820,
// 		sessionName: 'Console',
// 		sessionNumber: 1,
// 		memUsage: 4415488
// 	}, …]
// 	*/
// })();

const args = process.argv.slice(2);

const path = require("path");
const { app } = require("electron");

function createDesktop() {
	const process = require("child_process");
	var ls = process.spawn(
		path.join(__dirname, "native", "win10", "taskbar_close.cmd")
	);
	setTimeout(() => {
		require(path.join(__dirname, "desktops", "AnimeJS"));
	}, 3000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createDesktop);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// process.stdin.resume();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function exitHandler() {
	const child_process = require("child_process");
	var ls = child_process.spawn(
		path.join(__dirname, "native", "win10", "taskbar_open.cmd")
	);
}

//do something when app is closing
app.on("before-quit", () => {
	console.log("Closing...");
	exitHandler();
	setTimeout(() => {
		app.exit(0);
	}, 3000);
});
