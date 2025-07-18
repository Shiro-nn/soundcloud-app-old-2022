const { app, Menu, BrowserWindow, Tray, Notification, shell, ipcMain, protocol, session, globalShortcut } = require('electron');
const remote = require("@electron/remote/main");
const { exec } = require('child_process');
const drp = require('discord-rich-presence');
const path = require('path');
const fs = require('fs');
const CSPBypass = require('./CSPBypass/CSPBypass');
const appdata = require('appdata-path');
const HrefLoc = appdata.getAppDataPath("SoundCloud/AppBD");
const {Server, Client} = require('qurre-socket');
const tpu = require('./modules/TCPPortUsing');
const DiscordInstaller = require('./modules/DiscordInstaller');
const AutoUpdater = require('./modules/AutoUpdater');
const _localize = Intl.DateTimeFormat().resolvedOptions().locale;
const rulang = _localize.includes('ru') || _localize.includes('kk') || _localize.includes('ky') || _localize.includes('be');
let win;
try{app.commandLine.appendArgument("--disable-site-isolation-trials");}catch{}
try{app.commandLine.appendSwitch('disable-site-isolation-trials', true);}catch{}
app.commandLine.appendSwitch('proxy-bypass-list', '<local>;*.scpsl.store;'+
'*.google.com;*.gstatic.com;'+//google
//'www.google.com;accounts.google.com;ssl.gstatic.com;'+//google
'appleid.apple.com;iforgot.apple.com;www.apple.com;appleid.cdn-apple.com;is4-ssl.mzstatic.com');//apple
const dev = true;
const AppPort = dev ? 3535 : 45828;
let ShowRPC = true;
async function createWindow() {
    const _portUse = await PortUsing();
    if(_portUse) return;
    setTimeout(() => {try{DiscordInstaller();}catch{}}, 0);
    const updater = await AutoUpdater();
    await require('./modules/ProtocolInjector')();
    remote.initialize();
    win = new BrowserWindow({
        show: false,
        width: 1280,
        height: 720,
        icon: updater.logo,
        webPreferences: {
            devTools: false,
            sandbox: false,
            webviewTag: true,
            //webSecurity: false,
            nodeIntegration: true,
            nativeWindowOpen: true,
            contextIsolation: false,
            enableRemoteModule: true,
            //allowRunningInsecureContent: true,
            worldSafeExecuteJavaScript: false,
            preload: path.join(__dirname, 'CSPBypass/preload.js')
        },
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0D1117',
        title: 'SoundCloud',
        darkTheme: true,
    });
    remote.enable(win.webContents);

    require('./modules/startupMenu')(win);
    await require('./modules/ProxyManager')(win);

    //const ext = await session.defaultSession.loadExtension(path.join(__dirname, 'vpn'))
    const bypass = await CSPBypass.Create(win);
    win.once('ready-to-show', () => {
        win.show();
        try{updater.win.minimize();}catch{}
        setTimeout(() => {try{updater.win.close();}catch{}}, 1000); 
    });
    win.on('close', (e) => {
        e.preventDefault();
        win?.hide();
    });
    win.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
      (d, c)=>{
        if(d.responseHeaders['X-Frame-Options']){
          delete d.responseHeaders['X-Frame-Options'];
        } else if(d.responseHeaders['x-frame-options']) {
          delete d.responseHeaders['x-frame-options'];
        }
  
        c({cancel: false, responseHeaders: d.responseHeaders});
      }
    );

    ipcMain.on('navbarEvent', (event, code) => {
        if (code == 1) win.minimize();
        else if (code == 2) {
            if (win.isMaximized()) win.unmaximize();
            else win.maximize();
        }
        else if (code == 3) win.hide();
    });

    win.on('focus', () => {
        globalShortcut.register('CommandOrControl+F', function () {
            if(win) win.send('on-find', '')
        });
        globalShortcut.register('CommandOrControl+R', async() => {
            const __lastUrl = await GetLastUrl();
            bypass.loadUrl('https://soundcloud.com/'+__lastUrl);
        });
        globalShortcut.register('CommandOrControl+Shift+R', async() => {
            const __lastUrl = await GetLastUrl();
            bypass.loadUrl('https://soundcloud.com/'+__lastUrl);
        });
    })
    win.on('blur', () => {
        globalShortcut.unregister('CommandOrControl+F');
        globalShortcut.unregister('CommandOrControl+R');
        globalShortcut.unregister('CommandOrControl+Shift+R');
    })
    
    const _server = new Server(AppPort);
    _server.on('connection', (socket)=>{
        socket.on('OpenApp', () => win.show());
        socket.on('LastUrl', ([url]) => UpdateLastUrl(url));
        socket.on('RPC', ([rpc]) => {
            try{_server.emit('DiscordSCStatus', rpc)}catch{}
            UpdateRPC(rpc);
        });
        socket.on('SetUrl', ([url]) => {
            try{socket.emit('protocol.shutdown')}catch{}
            const _url = 'https://soundcloud.com/'+url.replace('sc://', '');
            _server.emit('app.changeurl', _url);
            win.show();
            UpdateLastUrl(_url);
        });
        socket.on('DiscordSCButtonClick', ([id]) => _server.emit('ClickSCButton', id));
        socket.on('discord.setRPC', ([val]) => ShowRPC = val);
    });
    const __portUse = await PortUsing();
    if(__portUse) return;
    await _server.initialize();

    //win.loadFile('index.html');
    //win.loadURL('https://soundcloud.com');
    const _lastUrl = await GetLastUrl();
    bypass.loadUrl('https://soundcloud.com/'+_lastUrl);
}
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});
const _platform = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
app.on('web-contents-created', function (webContentsCreatedEvent, contents) {
    if (contents.getType() === 'webview') {
        contents.on('new-window', function (ev, url) {
            setTimeout(() => {
                const wins = BrowserWindow.getAllWindows();
                wins[wins.length-1].setBackgroundColor('#0D1117');
            }, 100);
            if(url == 'about:blank') return;
            console.log('block: ' + url);
            ev.preventDefault();
            exec(_platform + ' ' + url);
        });
    }
});
async function PortUsing() {
    const _portUse = await tpu(AppPort, '127.0.0.1');
    if(_portUse){
        const _client = new Client(AppPort);
        _client.emit('OpenApp');
        setTimeout(() => app.quit(), 100);
    }
    return _portUse;
}
async function UpdateLastUrl(url) {
    if(url == 'about:blank') return;
    console.log(url)
    if (!fs.existsSync(HrefLoc)) await fs.promises.mkdir(HrefLoc, {recursive: true});
    fs.writeFile(path.join(HrefLoc, 'LastUrl'), url, 'utf-8', () => {});
}
function GetLastUrl() {
    return new Promise(async resolve => {
        if (!fs.existsSync(HrefLoc)) await fs.promises.mkdir(HrefLoc, {recursive: true});
        if (!fs.existsSync(path.join(HrefLoc, 'LastUrl'))) return resolve('');
        fs.readFile(path.join(HrefLoc, 'LastUrl'), 'utf-8', (err, _url) => {
            if(_url == undefined || _url == null) return resolve('');
            resolve(_url.replace('https://soundcloud.com/', ''))
        });
    });
}
let RPClient;
function UpdateRPC(data) {
    try{
        if(RPClient == null) RPClient = drp('963105038987849738');
        if(!ShowRPC){
            RPClient.updatePresence();
            return;
        }
        RPClient.updatePresence({
            state: `${rulang ? 'Автор:' : 'By'} ${data.author}`,
            details: `${rulang ? 'Слушает:' : 'Listening'} ${data.name}`,
            startTimestamp: data.playing ? (Date.now() - data.pos * 1000) : undefined,
            endTimestamp: data.playing ? (Date.now() + (data.max - data.pos) * 1000) : undefined,
            largeImageKey: 'logo',
            smallImageKey: data.playing ? 'play' : 'pause',
            smallImageText: data.playing ? (rulang ? 'Играет' : 'Playing') : (rulang ? 'На паузе' : 'Paused'),
            instance: false,
        });
    }catch{}
}