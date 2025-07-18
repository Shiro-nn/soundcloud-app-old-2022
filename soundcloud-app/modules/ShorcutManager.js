/* not need
const { platform, homedir } = require('os');
const { app, shell } = require('electron');
const Downloader = require('nodejs-file-downloader');
const iconDir = path.join(app.getPath('appData'), 'SoundCloud', 'img');
const icon = path.join(iconDir, 'appLogo.ico');
const fs = require('original-fs');
const path = require('path');
const SCPS = path.join(
    app.getPath('appData'),
    'Microsoft',
    'Windows',
    'Start Menu',
    'Programs',
    'SoundCloud.lnk'
);
const SCPD = path.join(homedir(), 'Desktop', 'SoundCloud.lnk');
module.exports = async() => {
    if (!platform().startsWith("win")) return;
    const options = {
        appUserModelId: 'SoundCloud Desktop App',
        description: 'SoundCloud Desktop App for Windows',
        target: process.execPath,
        icon, iconIndex: 0
    }
    if (!fs.existsSync(icon)) {
        const download = new Downloader({
            url: 'https://cdn.scpsl.store/soundcloud/img/appLogo.ico',
            directory: iconDir
        });
        await download.download();
    }
    if (fs.existsSync(SCPD)) shell.writeShortcutLink(SCPD, 'update', options);
    if (fs.existsSync(SCPS)) shell.writeShortcutLink(SCPS, 'update', options);
    else shell.writeShortcutLink(SCPS, 'create', options);
} */