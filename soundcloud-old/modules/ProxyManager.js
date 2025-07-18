const electron = require('electron');
const { Notify } = require('notify-manager-electron');
const HttpsProxyAgent = require('https-proxy-agent');
const nfetch = require('node-fetch');
const config = require('../config');

const _localize = Intl.DateTimeFormat().resolvedOptions().locale;
const rulang = _localize.includes('ru') || _localize.includes('kk') || _localize.includes('ky') || _localize.includes('be');
const translations = (rulang ? config.translations.ru : (config.translations[_localize] ?? config.translations.en)) ?? {
    proxy_available_not_found: 'Available proxy servers not found',
    proxy_work_not_found: 'Working proxy servers not found',
    proxy_connected: 'Connected to proxy server - [HIDDEN]',
};

module.exports = async (nmanager) => {
    const proxyList = config.proxy.default;

    if (config.proxy.usePublic) { // just hide it for eyes safety; soooo~ small, need moooooreee;
        try {
            const spys = await GetResponce('https://spys.me/proxy.txt');
            if (spys != null) {
                const arr = spys.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    if (str.includes('CH-')) {
                        const _proxy = str.split(' ')[0];
                        if (_proxy.includes('.') && _proxy.includes(':')) {
                            proxyList.push(_proxy);
                        }
                    }
                }
            }
        } catch { }
        try {
            const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=http&country=CH');
            if (plist != null) {
                const arr = plist.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const _proxy = arr[i];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        proxyList.push(_proxy);
                    }
                }
            }
        } catch { }
        try {
            const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?selectedCountry=CH&status=1&' +
                'ping=&selectedType=HTTP&selectedType=HTTPS&selectedType=SOCKS4&selectedType=SOCKS5');
            if (pscan != null) {
                const arr = pscan.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split('>')[1]?.split('<')[0];
                    if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                        const port = arr[i + 1].split('>')[1]?.split('<')[0];
                        if (port != null && port != undefined) {
                            proxyList.push(_proxy + ':' + port);
                        }
                    }
                }
            }
        } catch { }
    }

    if (proxyList.length == 0) {
        nmanager.show(new Notify('SoundCloud', translations.proxy_available_not_found, 10, __dirname + '/../icons/appLogo.png'));
        return;
    }

    let proxy = '';
    for (let i = 0; proxy == '' && i < proxyList.length; i++) {
        const _proxy = proxyList[i];
        const _check = await ProxyCheck(_proxy);
        if (_check) proxy = _proxy;
    }

    if (proxy.length > 0) {
        electron.app.commandLine.appendSwitch('proxy-server', proxy);

        if(proxy.includes('@')){
            const auth = proxy.split('@')[0]?.split(':') ?? ['', ''];
            electron.app.on('login', async (event, webContents, request, authInfo, callback) => {
                if(authInfo.isProxy){
                    callback(auth[0], auth[1]); // login, password
                }
            });
        }

        nmanager.show(new Notify('SoundCloud', translations.proxy_connected.replaceAll('{ip}', proxy), 10, __dirname + '/../icons/data-server.png'));
        return;
    }

    nmanager.show(new Notify('SoundCloud', translations.proxy_work_not_found, 10));
};

function ProxyCheck(proxy) {
    return new Promise(async resolve => {
        let _sended = false;
        setTimeout(() => {
            if (_sended) return;
            resolve(false);
            _sended = true;
        }, 10000);
        const proxyAgent = new HttpsProxyAgent('http://' + proxy);
        nfetch('https://soundcloud.com', {agent: proxyAgent})
        .then(() => {
            resolve(true);
            _sended = true;
        }).catch(() => {
            resolve(false);
            _sended = true;
        });
    });
}

function GetResponce(url) {
    return new Promise(async resolve => {
        let _sended = false;
        setTimeout(() => {
            if (_sended) return;
            resolve(null);
            _sended = true;
        }, 10000);
        try{
            const res = await fetch(url);
            if (_sended) return;
            const _text = await res.text();
            if (_sended) return;
            resolve(_text);
            _sended = true;
        }catch{
            resolve(null);
            _sended = true;
        }
    });
}