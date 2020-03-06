"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const os_1 = require("os");
const getMonitorInfo = (id) => {
    if (!__1.addon || !__1.addon.getMonitorInfo)
        return;
    return __1.addon.getMonitorInfo(id);
};
class Monitor {
    constructor(id) {
        this.id = id;
    }
    getBounds() {
        return getMonitorInfo(this.id).bounds;
    }
    getWorkArea() {
        return getMonitorInfo(this.id).workArea;
    }
    isPrimary() {
        return getMonitorInfo(this.id).isPrimary;
    }
    getScaleFactor() {
        if (!__1.addon || !__1.addon.getMonitorScaleFactor)
            return;
        const numbers = os_1.release()
            .split(".")
            .map(d => parseInt(d, 10));
        if (numbers[0] > 8 || (numbers[0] === 8 && numbers[1] >= 1)) {
            return __1.addon.getMonitorScaleFactor(this.id);
        }
        return 1;
    }
    ;
    isValid() {
        return __1.addon && __1.addon.getMonitorInfo;
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=monitor.js.map