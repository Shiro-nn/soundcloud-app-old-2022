const ProtocolRegistry = require("protocol-registry");
const appdata = require('appdata-path');
const fs = require('original-fs');
const Downloader = require('nodejs-file-downloader');
const path = require('path');
const ProtocolLocDir = appdata.getAppDataPath("SoundCloud/Protocol");
const ProtocolLoc = path.join(ProtocolLocDir, 'SoundCloud.exe');
module.exports = async() => {
    console.log('\x1b[33m%s\x1b[0m', 'Protocol injecting...');
    if (!fs.existsSync(ProtocolLocDir)) fs.promises.mkdir(ProtocolLocDir, {recursive: true});
    if (!fs.existsSync(ProtocolLoc)) {
        const download = new Downloader({
            url: 'https://cdn.scpsl.store/soundcloud/protocol/SoundCloud.exe',
            directory: ProtocolLocDir
        });
        await download.download();
    }
    ProtocolRegistry.register({
        protocol: "sc",
        command: `${ProtocolLoc} $_URL_`,
        override: true,
        terminal: false,
        script: false,
    }).then(async () => {
        console.log('\x1b[32m%s\x1b[0m', 'Protocol injected');
    });
};