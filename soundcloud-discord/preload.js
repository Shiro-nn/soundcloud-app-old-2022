const {Client} = require('qurre-socket');
const _client = new Client(45828);
const PanelId = 'SoundCloudManagePanel';
const ShowRpcId = 'SoundCloudShowingRpcPanel';
const SoundCloudBarModules = {panel:null,img:null,title:null,author:null,playpause:null,times:{cur:null,total:null},processing:{line:null,rad:null}};
const PlayIcon = '';
const PauseIcon = '';
function GetOrUpdateRPC(){
    const _data = window.localStorage.getItem('rpc.soundcloud');
    if(_data == null || _data == undefined){
        window.localStorage.setItem('rpc.soundcloud', true);
        return true;
    }
    return (_data == 'true');
}
function SetRPC(val){
    window.localStorage.setItem('rpc.soundcloud', val);
}
_client.on('connect', () => _client.emit('discord.setRPC', GetOrUpdateRPC()));
_client.on('disconnect', () => SoundCloudBarModules.panel.style.display = 'none');
_client.on('DiscordSCStatus', ([rpc]) => {
    if(rpc.status != 'found') return SoundCloudBarModules.panel.style.display = 'none';
    else SoundCloudBarModules.panel.style = '';
    if(SoundCloudBarModules.img.src != rpc.img) SoundCloudBarModules.img.src = rpc.img;
    if(SoundCloudBarModules.title.innerHTML != rpc.name) SoundCloudBarModules.title.innerHTML = rpc.name;
    if(SoundCloudBarModules.author.innerHTML != rpc.author) SoundCloudBarModules.author.innerHTML = rpc.author;
    SoundCloudBarModules.playpause.innerHTML = rpc.playing ? PauseIcon : PlayIcon;
    if(SoundCloudBarModules.times.cur.innerHTML != rpc.times.cur) SoundCloudBarModules.times.cur.innerHTML = rpc.times.cur;
    SoundCloudBarModules.times.total.innerHTML = rpc.times.total;
    const perc = rpc.pos / rpc.max * 100;
    SoundCloudBarModules.processing.line.style.width = `${perc}%`;
    SoundCloudBarModules.processing.rad.style.left = `${perc}%`;
});
setInterval(() => {
    const _st = document.getElementById(PanelId);
    if(_st != null) return;
    CreateSCBar();
}, 2000);
setInterval(() => {
    const _st = document.getElementById(ShowRpcId);
    if(_st != null) return;
    CreateEnDsSc();
}, 2000);
LoadDefaultPreLoad();

let _lastClick = Date.now();
function CreateEnDsSc() {
    const asct = document.getElementsByTagName('section');
    for (let i = 0; i < asct.length; i++) {
        const asc = asct[i];
        if(!asc.className.includes('panels-')) continue;
        for (let o = 0; o < asc.children.length; o++) {
            const dw = asc.children[o];
            if(!dw.className.includes('container-')) continue;
            for (let o = 0; o < dw.children.length; o++) {
                const fe = dw.children[o];
                if(!fe.className.includes('directionRow-')) continue;
                fe.style.position = 'sticky';
                fe.style.right = '5px';
                console.log(fe)
                const _ex = fe.children[0];
                const q0 = document.createElement('button');
                q0.id = ShowRpcId;
                q0.className = _ex.className;
                if(GetOrUpdateRPC()) q0.className += ' show';
                q0.addEventListener('click', () => {
                    if((Date.now() - _lastClick) < 500) return;
                    _lastClick = Date.now();
                    if(GetOrUpdateRPC()){
                        q0.className = q0.className.replace(' show', '');
                        SetRPC(false);
                        if(_client.connected) _client.emit('discord.setRPC', false);
                    }else{
                        q0.className += ' show';
                        SetRPC(true);
                        if(_client.connected) _client.emit('discord.setRPC', true);
                    }
                });
                const q1 = document.createElement('div');
                try{q1.className = _ex.children[0].className;}catch{}
                q1.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="24px" '+
                'viewBox="0 0 30 24" version="1.1"><g id="surface1"><line stroke="#ff0000" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_4" '+
                'y2="4" x2="30" y1="20" x1="0" fill="none"/><path style=" stroke:none;fill-rule:nonzero;fill:#b9bbbe;fill-opacity:'+
                '1;" d="M 5.222656 12.015625 L 5.492188 15.0625 L 5.222656 18.261719 C 5.207031 18.378906 5.117188 18.46875 5.015625 18.46875 C 4.914062'+
                ' 18.46875 4.820312 18.378906 4.820312 18.261719 L 4.554688 15.0625 L 4.820312 12.015625 C 4.820312 11.910156 4.90625 11.816406 5.015625'+
                ' 11.816406 C 5.117188 11.816406 5.207031 11.910156 5.222656 12.015625 Z M 6.226562 9.875 C 6.09375 9.875 6.003906 9.980469 5.992188 10.'+
                '109375 L 5.757812 15.0625 L 5.992188 18.261719 C 6.003906 18.394531 6.09375 18.496094 6.226562 18.496094 C 6.34375 18.496094 6.445312 18'+
                '.394531 6.445312 18.261719 L 6.71875 15.0625 L 6.445312 10.109375 C 6.445312 9.980469 6.34375 9.875 6.226562 9.875 Z M 7.421875 8.746094 '+
                'C 7.273438 8.746094 7.171875 8.851562 7.15625 8.996094 L 6.953125 15.089844 L 7.15625 18.265625 C 7.171875 18.414062 7.273438 18.515625 7.'+
                '421875 18.515625 C 7.550781 18.515625 7.667969 18.414062 7.667969 18.265625 L 7.917969 15.089844 L 7.667969 8.996094 C 7.667969 8.851562 7.'+
                '550781 8.746094 7.421875 8.746094 Z M 0.335938 13.273438 C 0.273438 13.273438 0.234375 13.328125 0.21875 13.390625 L 0 15.0625 L 0.21875 16'+
                '.703125 C 0.234375 16.765625 0.273438 16.820312 0.335938 16.820312 C 0.402344 16.820312 0.441406 16.765625 0.453125 16.703125 L 0.71875 15'+
                '.0625 L 0.453125 13.390625 C 0.441406 13.328125 0.402344 13.273438 0.335938 13.273438 Z M 1.445312 12.25 C 1.378906 12.25 1.328125 12.300'+
                '781 1.328125 12.367188 L 1.027344 15.0625 L 1.328125 17.691406 C 1.328125 17.769531 1.378906 17.820312 1.445312 17.820312 C 1.507812 17.8'+
                '20312 1.5625 17.769531 1.574219 17.703125 L 1.914062 15.0625 L 1.574219 12.367188 C 1.5625 12.300781 1.507812 12.25 1.445312 12.25 Z M 2'+
                '.628906 11.714844 C 2.550781 11.714844 2.484375 11.78125 2.476562 11.867188 L 2.203125 15.0625 L 2.476562 18.144531 C 2.488281 18.226562'+
                ' 2.554688 18.289062 2.628906 18.289062 C 2.710938 18.289062 2.773438 18.226562 2.773438 18.144531 L 3.097656 15.0625 L 2.773438 11.8671'+
                '88 C 2.773438 11.78125 2.710938 11.714844 2.628906 11.714844 Z M 3.816406 11.609375 C 3.726562 11.609375 3.648438 11.675781 3.648438 1'+
                '1.78125 L 3.375 15.0625 L 3.648438 18.238281 C 3.648438 18.34375 3.726562 18.40625 3.816406 18.40625 C 3.90625 18.40625 3.984375 18.3'+
                '4375 4 18.238281 L 4.296875 15.0625 L 4 11.78125 C 3.984375 11.675781 3.90625 11.609375 3.816406 11.609375 Z M 15.132812 6.414062 C 1'+
                '5.078125 6.375 15 6.347656 14.933594 6.347656 C 14.832031 6.347656 14.738281 6.382812 14.671875 6.4375 C 14.582031 6.515625 14.527344'+
                ' 6.632812 14.515625 6.75 L 14.515625 6.789062 L 14.363281 15.070312 L 14.441406 16.59375 L 14.523438 18.078125 C 14.535156 18.300781'+
                ' 14.71875 18.484375 14.9375 18.484375 C 15.160156 18.484375 15.34375 18.300781 15.34375 18.078125 L 15.523438 15.070312 L 15.34375 6'+
                '.75 C 15.324219 6.609375 15.25 6.476562 15.132812 6.414062 Z M 13.878906 7.128906 C 13.8125 7.09375 13.75 7.0625 13.671875 7.0625 C '+
                '13.597656 7.0625 13.527344 7.09375 13.46875 7.128906 C 13.363281 7.195312 13.296875 7.3125 13.296875 7.445312 L 13.285156 7.523438 L'+
                ' 13.152344 15.0625 C 13.152344 15.0625 13.152344 15.074219 13.296875 18.136719 L 13.296875 18.148438 C 13.296875 18.230469 13.328125'+
                ' 18.304688 13.378906 18.371094 C 13.457031 18.460938 13.5625 18.515625 13.679688 18.515625 C 13.78125 18.515625 13.875 18.464844 13.'+
                '941406 18.398438 C 14.019531 18.332031 14.058594 18.242188 14.058594 18.136719 L 14.070312 17.820312 L 14.21875 15.074219 L 14.0625'+
                ' 7.445312 C 14.046875 7.3125 13.984375 7.195312 13.878906 7.128906 Z M 8.65625 8.183594 C 8.511719 8.183594 8.386719 8.316406 8.386'+
                '719 8.46875 L 8.179688 15.0625 L 8.386719 18.210938 C 8.398438 18.367188 8.515625 18.484375 8.65625 18.484375 C 8.8125 18.484375 8.9'+
                '29688 18.367188 8.945312 18.210938 L 9.179688 15.0625 L 8.945312 8.46875 C 8.933594 8.316406 8.816406 8.183594 8.65625 8.183594 Z M '+
                '26.316406 11.128906 C 25.808594 11.128906 25.328125 11.230469 24.882812 11.414062 C 24.582031 8.09375 21.796875 5.488281 18.398438 5'+
                '.488281 C 17.5625 5.488281 16.757812 5.644531 16.039062 5.929688 C 15.753906 6.03125 15.675781 6.136719 15.675781 6.359375 L 15.6757'+
                '81 18.066406 C 15.675781 18.300781 15.859375 18.46875 16.078125 18.496094 L 26.3125 18.496094 C 28.339844 18.496094 29.996094 16.855'+
                '469 29.996094 14.828125 C 30 12.78125 28.34375 11.128906 26.316406 11.128906 Z M 12.40625 8.300781 C 12.210938 8.300781 12.054688 8.'+
                '457031 12.042969 8.667969 L 11.886719 15.074219 L 12.042969 18.148438 C 12.054688 18.347656 12.210938 18.5 12.40625 18.5 C 12.605469'+
                ' 18.5 12.757812 18.347656 12.757812 18.148438 L 12.941406 15.074219 L 12.757812 8.667969 C 12.746094 8.457031 12.605469 8.300781 12.'+
                '40625 8.300781 Z M 9.894531 7.9375 C 9.742188 7.9375 9.59375 8.082031 9.59375 8.25 L 9.414062 15.0625 L 9.59375 18.195312 C 9.609375'+
                ' 18.367188 9.742188 18.496094 9.894531 18.496094 C 10.0625 18.496094 10.195312 18.367188 10.210938 18.195312 L 10.414062 15.0625 L 1'+
                '0.210938 8.25 C 10.195312 8.082031 10.0625 7.9375 9.894531 7.9375 Z M 11.148438 8.09375 C 10.964844 8.09375 10.824219 8.242188 10.82'+
                '4219 8.417969 L 10.640625 15.0625 L 10.824219 18.171875 C 10.835938 18.355469 10.96875 18.496094 11.148438 18.496094 C 11.324219 18.'+
                '496094 11.46875 18.351562 11.46875 18.171875 L 11.667969 15.0625 L 11.46875 8.417969 C 11.46875 8.234375 11.328125 8.09375 11.148438'+
                ' 8.09375 Z M 11.148438 8.09375 "/></g></svg>'; 
                q0.appendChild(q1);
                fe.insertBefore(q0, _ex);
            }
        }
    }
}

function CreateSCBar() {
    const asct = document.getElementsByTagName('section');
    for (let i = 0; i < asct.length; i++) {
        const asc = asct[i];
        if(!asc.className.includes('panels-')) continue;
        for (let o = 0; o < asc.children.length; o++) {
            const dw = asc.children[o];
            if(!dw.className.includes('wrapper-')) continue;
            const q0 = document.createElement("div");
            q0.id = PanelId;
            q0.style.display = 'none';
            const _ex = dw.children[0];
            if(_ex == undefined || _ex == null) dw.appendChild(q0);
            else dw.insertBefore(q0, _ex);
            SoundCloudBarModules.panel = q0;
            const st = document.createElement("style");
            st.innerHTML = GetCss(asc.className);
            q0.appendChild(st);
            const q1 = document.createElement("div");
            q1.className = 'sc1';
            q0.appendChild(q1);
            const q2 = document.createElement("div");
            q2.className = 'sc2';
            q1.appendChild(q2);

            const q3 = document.createElement("a");
            q3.className = 'sc3';
            let max = false;
            q3.addEventListener('click', () => {
                max = !max;
                q1.className = max ? 'sc1' : 'sc1 sc1-max';
            })
            q2.appendChild(q3);
            const q4 = document.createElement("img");
            q4.className = 'sc4';
            SoundCloudBarModules.img = q4;
            q3.appendChild(q4);

            const q5 = document.createElement("div");
            q5.className = 'sc5';
            q2.appendChild(q5);
            const q6 = document.createElement("span");
            q6.className = 'sc6';
            q5.appendChild(q6);
            const q7 = document.createElement("div");
            q7.style.position = 'relative';
            q7.style.display = 'block';
            q7.style.overflow = 'hidden';
            q7.style.color = '#fff';
            q7.innerHTML = '';
            SoundCloudBarModules.title = q7;
            q6.appendChild(q7);

            const q8 = document.createElement("span");
            q8.className = 'sc8';
            q8.style.fontSize = '12px';
            q8.style.lineHeight = '16px';
            q5.appendChild(q8);
            const q9 = document.createElement("div");
            q9.className = 'sc9';
            q9.style.position = 'relative';
            q9.style.display = 'block';
            q9.style.overflow = 'hidden';
            q9.style.color = '#62646a';
            q9.innerHTML = '';
            SoundCloudBarModules.author = q9;
            q6.appendChild(q9);
            
            const q10 = document.createElement("div");
            q10.className = 'sc10';
            q2.appendChild(q10);
            const q11 = document.createElement("div");
            q11.className = 'sc11';
            q11.style.display = 'flex';
            q11.style.flexGrow = '0';
            q10.appendChild(q11);
            
            const q13 = document.createElement("div");
            q13.className = 'sc13';
            q11.appendChild(q13);
            const q12 = document.createElement("a");
            q12.className = 'sc12';
            q12.style.background = 'transparent';
            q12.style.border = 0;
            q12.style.padding = 0;
            q12.innerHTML = '';
            q13.appendChild(q12);
            let prevLast = Date.now() + 500;
            q12.addEventListener('click', () => {
                if(Date.now() - prevLast < 0) return;
                prevLast = Date.now() + 500;
                _client.emit('DiscordSCButtonClick', 1);
            })
            
            const q131 = document.createElement("div");
            q131.className = 'sc13';
            q11.appendChild(q131);
            const q121 = document.createElement("a");
            q121.className = 'sc12';
            q121.style.background = 'transparent';
            q121.style.border = 0;
            q121.style.padding = 0;
            q121.innerHTML = PlayIcon;
            q131.appendChild(q121);
            SoundCloudBarModules.playpause = q121;
            let ppLast = Date.now() + 500;
            q121.addEventListener('click', () => {
                if(Date.now() - ppLast < 0) return;
                ppLast = Date.now() + 500;
                _client.emit('DiscordSCButtonClick', 2);
            })
            
            const q132 = document.createElement("div");
            q132.className = 'sc13';
            q11.appendChild(q132);
            const q122 = document.createElement("a");
            q122.className = 'sc12';
            q122.style.background = 'transparent';
            q122.style.border = 0;
            q122.style.padding = 0;
            q122.innerHTML = '';
            q132.appendChild(q122);
            let nextLast = Date.now() + 500;
            q122.addEventListener('click', () => {
                if(Date.now() - nextLast < 0) return;
                nextLast = Date.now() + 500;
                _client.emit('DiscordSCButtonClick', 3);
            })

            
            const q14 = document.createElement("div");
            q14.className = 'sc14';
            q1.appendChild(q14);
            const q15 = document.createElement("div");
            q15.className = 'sc15';
            q14.appendChild(q15);
            const q16 = document.createElement("div");
            q16.className = 'sc16';
            q16.style.width = '0%';
            q15.appendChild(q16);
            const q17 = document.createElement("div");
            q17.className = 'sc17';
            q17.style.left = '0%';
            q15.appendChild(q17);
            const q18 = document.createElement("div");
            q18.className = 'sc18';
            q14.appendChild(q18);
            const q19 = document.createElement("span");
            q19.style.fontSize = '12px';
            q19.style.lineHeight = '16px';
            q19.style.color = '#fff';
            q19.innerHTML = '0:00';
            q18.appendChild(q19);
            SoundCloudBarModules.times.cur = q19;
            const q20 = document.createElement("span");
            q20.style.fontSize = '12px';
            q20.style.lineHeight = '16px';
            q20.style.color = '#fff';
            q20.innerHTML = '0:00';
            q18.appendChild(q20);
            SoundCloudBarModules.times.total = q20;
            SoundCloudBarModules.processing.line = q16;
            SoundCloudBarModules.processing.rad = q17;

            q14.addEventListener('click', (e)=>{
                const wdth = q14.clientWidth;
                const rect = q14.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const perc = x/wdth*100;
                console.log('sc test: '+perc)
            });
        }
    }
}

function LoadDefaultPreLoad() {
    const preload = process.env._defpre;
    if (preload) {
        try {
            const e = process.kill;
            process.kill = function() {};
            require(preload);
            process.kill = e;
        } catch (e) {console.error(e)}
    }
}

function GetCss(s1) {
    return `
    @font-face {
        font-family: glue1-spoticon;
        src: url("https://cdn.scpsl.store/soundcloud/fonticons.ttf") format("truetype");
        font-weight: 400;
        font-style: normal
    }
    :root {
        --sc-color: #ff7700;
    }
    .${s1} {
        display: flex;
        flex-direction: column;
    }
    .sc1 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 52px;
        margin-top: 1px;
        margin-bottom: 1px;
        border-bottom: 1px solid var(--background-modifier-accent);
        padding: 0 8px;
        box-sizing: border-box;
        order: -1;
    }
    .sc2 {
        display: flex;
        align-items: center;
        font-size: 14px;
        width: 100%;
    }
    .sc12{font-family: glue1-spoticon !important;}
    .sc14 {
        margin: 6px 0 4px 0;
    }
    .sc15 {
        position: relative;
        border-radius: 2px;
        background-color: rgba(79, 84, 92, 0.16);
        height: 4px;
        margin-bottom: 4px;
    }
    .sc16 {
        border-radius: 2px;
        height: 100%;
        min-width: 4px;
        border-radius: 2px;
        background: var(--text-normal);
    }
    .sc14:hover .sc16 {
        background: var(--sc-color);
    }
    .sc17 {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        margin-top: -2px;
        margin-left: -2px;
        background: var(--text-normal);
        border-radius: 50%;
    }
    .sc14:hover .sc17 {
        display: block;
    }
    .sc18 {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .sc21{
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
    }
    .sc3 {
        position: relative;
        width: 32px;
        min-width: 32px;
        height: 32px;
        min-height: 32px;
        margin-right: 8px;
        border-radius: 4px;
        overflow: hidden;
        transition: border-radius .3s ease, margin .3s ease, width .3s ease, height .3s ease;
    }
    .sc4 {
        display: block;
        width: 100%;
        height: 100%;
        color: var(--header-primary);
        object-fit: cover;
    }
    .sc5 {
        flex-grow: 1;
        margin-right: 4px;
        min-width: 0;
        user-select: text;
    }
    .sc6 {
        font-weight: 500;
    }
    .sc6 div{
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sc8 {
        font-weight: 300;
    }
    .sc1 .sc12 {
        color: #8b949e;
        margin: 0 5px;
    }
    .sc1 .sc13{
        transform: scale(1.3);
        top: 0;
        align-items: center;
    }
    .sc1-max {
        padding-top: 0;
    }
    .sc1-max .sc2 {
        flex-direction: column;
    }
    .sc1-max .sc5 {
        margin: 0 0 4px 0;
        width: 100%;
        text-align: center;
    }
    .sc1-max .sc3 {
        width: calc(100% + 16px);
        height: 100%;
        margin: 0 0 8px 0;
        border-radius: 0;
    }
    .sc1-max .sc6 div{
        text-overflow: ellipsis;
        white-space: normal;
    }

    #${ShowRpcId} #svg_4 {
        display: block;
    }
    #${ShowRpcId}.show #svg_4 {
        display: none;
    }
`;
}