const electron = require('electron');
const request = require('request');
module.exports = async (win) => {
    const _result = await ProxyCheck('soundcloud-proxy.fydne.dev:3128') // proxy.scpsl.store:3128
    if(_result) electron.app.commandLine.appendSwitch('proxy-server', 'soundcloud-proxy.fydne.dev:3128');
    else new electron.Notification({
        title: 'SoundCloud',
        subtitle: 'SoundCloud',
        body: 'Произошла ошибка при подключении к прокси',
        icon: electron.nativeImage.createFromPath(__dirname + '/../icons/appLogo.png'),
        silent: true,
    }).show();
};
function ProxyCheck(proxy) {
    return new Promise(resolve => {
        let _sended = false;
        setTimeout(() => {
            if(_sended) return;
            resolve(false);
            _sended = true;
        }, 10000);
        request.get({
            url: 'https://soundcloud.com',
            proxy: 'http://'+proxy
        }, (err, res) => {
            if(_sended) return;
            if (err) resolve(false);
            else resolve(true);
            _sended = true;
        });
    });
}