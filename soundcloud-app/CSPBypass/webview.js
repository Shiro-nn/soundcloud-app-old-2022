const Client = require('qurre-socket').Client;
const AppPort = 45828;
const _client = new Client(AppPort);
const cachedRPC = {
    status: '',
    name: '',
    author: '',
    img: '',
    times:{cur:'',total:''},
    pos: 0,
    max: 0,
    playing: false,
};
function ThisOldRpc(data) {
    return cachedRPC.status == data.status &&
    cachedRPC.name == data.name &&
    cachedRPC.author == data.author &&
    cachedRPC.img == data.img &&
    cachedRPC.times.cur == data.times.cur &&
    cachedRPC.times.total == data.times.total &&
    cachedRPC.pos == data.pos &&
    cachedRPC.max == data.max &&
    cachedRPC.playing == data.playing;
}
window.addEventListener('DOMContentLoaded', () => {
    _client.on('app.changeurl', ([url]) => {
        history.pushState('SoundCloud', 'SoundCloud', url);
        history.back();
        setTimeout(() => history.forward(), 100);
    });
    _client.on('ClickSCButton', ([id]) => {
        setTimeout(() => SendRPC(), 100);
        if(id == 1) document.getElementsByClassName('skipControl__previous')[0].click();
        else if(id == 2) document.getElementsByClassName('playControls__play')[0].click();
        else if(id == 3) document.getElementsByClassName('skipControl__next')[0].click();
    });
    let lastUrlCache = '';
    let cwd = false;
    setInterval(() => {
        const fel = document.getElementById('onetrust-consent-sdk');
        if(fel != null){
            try{document.getElementById('onetrust-accept-btn-handler').click();}catch{}
            setTimeout(() => fel.outerHTML = '', 100);
            cwd = true;
        }
        try{
            const href = window.location.href;
            if(href != 'https://soundcloud.com' && href != 'https://soundcloud.com/' && lastUrlCache != href &&
            href != 'https://soundcloud.com/discover' && href != 'https://soundcloud.com/discover/'){
                lastUrlCache = href;
                _client.emit('LastUrl', href);
            }
        }catch{}
    }, cwd ? 2000 : 100);
    const StyleId = 'BlackStyleDesktopApp';
    AddStyle();
    setTimeout(() => {
        setInterval(() => {
            const _st = document.getElementById(StyleId);
            if(_st != null) return;
            AddStyle();
        }, 2000);
    }, 10000);
    setInterval(() => {
        const antipropaganda = document.getElementsByClassName('header__logoLink');
        for (let i = 0; i < antipropaganda.length; i++) {
            const apr = antipropaganda[i];
            try{apr.title = '';}catch{}
        }
    }, 2000);
    setInterval(() => SendRPC(), 1000);
    function SendRPC() {
        const title = document.querySelector(".playbackSoundBadge__titleLink"),
        author = document.querySelector(".playbackSoundBadge__titleContextContainer").querySelector("a"),
        img = document.querySelector(".playbackSoundBadge__avatar").querySelector("span").style.backgroundImage,
        progress = document.querySelector(".playbackTimeline__progressWrapper"),
        curtime = GetTimeElement(document.querySelector(".playbackTimeline__timePassed").querySelectorAll('span')),
        totaltime = GetTimeElement(document.querySelector(".playbackTimeline__duration").querySelectorAll('span')),
        play = document.querySelector(".playControls__play");
        if (!title || !progress || !play){
            _client.emit('RPC', {status: 'not found'});
            return;
        }
        const _rpc = {
            status: 'found',
            name: title.getAttribute("title"),
            author: author.getAttribute("title"),
            img: img.substring(5, img.length - 2).replace('50x50', '500x500'),
            times:{cur:curtime.innerHTML,total:totaltime.innerHTML},
            pos: parseInt(progress.getAttribute("aria-valuenow"), 10),
            max: parseInt(progress.getAttribute("aria-valuemax"), 10),
            playing: play.classList.contains("playing"),
        };
        if(ThisOldRpc(_rpc)) return;
        _client.emit('RPC', _rpc);
        cachedRPC.status = _rpc.status;
        cachedRPC.name = _rpc.name;
        cachedRPC.author = _rpc.author;
        cachedRPC.img = _rpc.img;
        cachedRPC.times.cur = _rpc.times.cur;
        cachedRPC.times.total = _rpc.times.total;
        cachedRPC.pos = _rpc.pos;
        cachedRPC.max = _rpc.max;
        cachedRPC.playing = _rpc.playing;
        function GetTimeElement(elements) {
            let elem;
            for (let i = 0; elem == null && i < elements.length; i++) {
                const element = elements[i];
                if(element.className.includes('visuallyhidden')) continue;
                elem = element;
            }
            return elem;
        }
    }
    function AddStyle() {
        const cssLink = document.createElement("link");
        cssLink.href = "https://cdn.scpsl.store/soundcloud/scb.css"; 
        cssLink.rel = "stylesheet"; 
        cssLink.type = "text/css";
        cssLink.id = StyleId;
        document.head.appendChild(cssLink);
    }
});
document.addEventListener('mousedown', (e) => { 
    if(e.button == 3) history.back();
    if(e.button == 4) history.forward();
})