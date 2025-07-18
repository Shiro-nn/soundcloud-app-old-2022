const appdata = require('appdata-path');
const electr = require("electron");
const path = require('path');
const BDLoc = appdata.getAppDataPath("BetterDiscord/data/betterdiscord.asar");
const DSLoc = path.join(electr.app.getAppPath(), "..", "app.asar");
const cpr = path.join(__dirname, "preload.js");
electr.app.commandLine.appendSwitch("preload", cpr);
electr.app.commandLine.appendSwitch('soundcloud', true);
class BrowserWindow extends electr.BrowserWindow {
    constructor(win) {
        if (!(win && win.webPreferences && win.webPreferences.preload && win.title))
            return super(win);
        const n = win.webPreferences.preload;
        win.webPreferences.preload = cpr;
        super(win);
        process.env._defpre = n;
        /*setInterval(() => {try{this.webContents.openDevTools()}catch{}}, 3000);*/
    }
}
Object.assign(BrowserWindow, electr.BrowserWindow);
class Rend {
    static patchBrowserWindow() {
        const e = require.resolve("electron");
        delete require.cache[e].exports,
        require.cache[e].exports = {
            ...electr,
            BrowserWindow
        }
    }
}
Rend.patchBrowserWindow();
electr.app.on('ready', () => {
    CSPB()
    electr.app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) CSPB()
    })
})
function CSPB() {
    electr.session.defaultSession.webRequest.onHeadersReceived((function(e, s) {
        if (!e.responseHeaders["content-security-policy-report-only"] && !e.responseHeaders["content-security-policy"])
            return s({
                cancel: !1
            });
        delete e.responseHeaders["content-security-policy-report-only"],
        delete e.responseHeaders["content-security-policy"],
        s({
            cancel: !1,
            responseHeaders: e.responseHeaders
        })
    }))
}
try{require(BDLoc);}catch{require(DSLoc);}