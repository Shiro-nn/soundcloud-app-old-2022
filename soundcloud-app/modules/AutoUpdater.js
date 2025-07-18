const { app, BrowserWindow } = require('electron');
const Downloader = require('nodejs-file-downloader');
const requests = require('./AutoUpdate/requests');
const appdata = require('appdata-path');
const fs = require('original-fs');
const path = require('path');
const version = require('../package.json').version;
const SCAAD = appdata.getAppDataPath("SoundCloud");
const SCAPD = path.join(SCAAD, 'Temp');
const SCAPI = path.join(SCAAD, 'img');
const SCAP = path.join(SCAPD, 'app.asar');
const SCAPL = path.join(SCAPI, 'appLogo.png');
const RunDir = app.getAppPath();

module.exports = async() => {
    const win = new BrowserWindow({
        show: true,
        width: 300,
        height: 400,
        icon: __dirname + "/../icons/appLogo.ico",
        webPreferences: {devTools: false},
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0D1117',
        title: 'SoundCloud Updater',
        darkTheme: true,
    });
    win.setResizable(false);
    await win.loadFile(path.join(path.join(__dirname, 'AutoUpdate'), 'render.html'));
    if (fs.existsSync(SCAP)) fs.rmSync(SCAP, { recursive: true, force: true });
    if (!fs.existsSync(SCAAD)) fs.promises.mkdir(SCAAD, {recursive: true});
    if (!fs.existsSync(SCAPD)) fs.promises.mkdir(SCAPD, {recursive: true});
    if (!fs.existsSync(SCAPI)) fs.promises.mkdir(SCAPI, {recursive: true});
    if (!fs.existsSync(SCAPL)) {
        const download = new Downloader({
            url: 'https://cdn.scpsl.store/soundcloud/img/appLogo.png',
            directory: SCAPI
        });
        await download.download();
    }
    if(!RunDir.includes('app.asar')) return {win: win, logo: SCAPL};
    const _req = await requests.Send('https://cdn.scpsl.store/soundcloud/updater/app.version');
    if(_req.error || _req.response.statusCode != 200) return {win: win, logo: SCAPL};
    if(_req.body == version) return {win: win, logo: SCAPL};
    const _download = new Downloader({
        url: `https://cdn.scpsl.store/soundcloud/updater/${_req.body}/app.asar`,
        directory: SCAPD
    });
    await _download.download();
    if (fs.existsSync(RunDir)) fs.rmSync(RunDir, { recursive: true, force: true });
    await CopyFile(SCAP, RunDir);
    try{fs.rmSync(SCAP, { recursive: true, force: true });}catch{}
    app.relaunch();
    app.exit();
    return {win: win, logo: SCAPL};
};
function CopyFile(src, dest) {return new Promise(resolve => fs.copyFile(src, dest, () => resolve()));}