"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmptyMonitor {
    getBounds() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    getWorkArea() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    isPrimary() {
        return false;
    }
    getScaleFactor() {
        return 1;
    }
    ;
    isValid() {
        return false;
    }
}
exports.EmptyMonitor = EmptyMonitor;
//# sourceMappingURL=empty-monitor.js.map