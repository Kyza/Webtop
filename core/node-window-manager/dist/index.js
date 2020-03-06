"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const window_1 = require("./classes/window");
exports.Window = window_1.Window;
const events_1 = require("events");
const os_1 = require("os");
const monitor_1 = require("./classes/monitor");
const empty_monitor_1 = require("./classes/empty-monitor");
let addon;
exports.addon = addon;
if (os_1.platform() === "win32" || os_1.platform() === "darwin") {
    const ADDON_PATH = (process.env.NODE_ENV != "dev") ? "Release" : "Debug";
    exports.addon = addon = require(`../build/${ADDON_PATH}/addon.node`);
}
let interval = null;
let registeredEvents = [];
class WindowManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.requestAccessibility = () => {
            if (!addon || !addon.requestAccessibility)
                return true;
            return addon.requestAccessibility();
        };
        this.getActiveWindow = () => {
            if (!addon)
                return;
            return new window_1.Window(addon.getActiveWindow());
        };
        this.getWindows = () => {
            if (!addon || !addon.getWindows)
                return [];
            return addon.getWindows().map((win) => new window_1.Window(win)).filter((x) => x.isWindow());
        };
        this.getMonitors = () => {
            if (!addon || !addon.getMonitors)
                return [];
            return addon.getMonitors().map((mon) => new monitor_1.Monitor(mon));
        };
        this.getPrimaryMonitor = () => {
            if (process.platform === 'win32') {
                return this.getMonitors().find(x => x.isPrimary);
            }
            else {
                return new empty_monitor_1.EmptyMonitor();
            }
        };
        let lastId;
        if (!addon)
            return;
        this.on("newListener", event => {
            if (registeredEvents.indexOf(event) !== -1)
                return;
            if (event === "window-activated") {
                interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const win = addon.getActiveWindow();
                    if (lastId !== win) {
                        lastId = win;
                        this.emit("window-activated", new window_1.Window(win));
                    }
                }), 50);
            }
            else {
                return;
            }
            registeredEvents.push(event);
        });
        this.on("removeListener", event => {
            if (this.listenerCount(event) > 0)
                return;
            if (event === "window-activated") {
                clearInterval(interval);
            }
            registeredEvents = registeredEvents.filter(x => x !== event);
        });
    }
}
const windowManager = new WindowManager();
exports.windowManager = windowManager;
//# sourceMappingURL=index.js.map