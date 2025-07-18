function iframeURLChange(iframe, callback) {
    var lastDispatched = null;

    var dispatchChange = function () {
        var newHref = iframe.contentWindow.location.href;

        if (newHref !== lastDispatched) {
            callback(newHref);
            lastDispatched = newHref;
        }
    };

    var unloadHandler = function () {
        setTimeout(dispatchChange, 0);
    };

    function attachUnload() {
        iframe.contentWindow.removeEventListener("unload", unloadHandler);
        iframe.contentWindow.addEventListener("unload", unloadHandler);
    }

    iframe.addEventListener("load", function () {
        attachUnload();
        dispatchChange();
        try{
            const gu = window.localStorage.getItem('LastOpenGuid');
            if(gu == window.api.UID) return;
            const _link = window.localStorage.getItem('LastURL');
            if(_link == null || _link == undefined || _link == 'https://soundcloud.com' || _link == 'https://soundcloud.com/') return;
            document.getElementsByTagName('iframe')[0].contentWindow.location = _link;
            window.localStorage.setItem('LastOpenGuid', window.api.UID);
        }catch{}
    });

    attachUnload();
}
let allowCloseLogin = true;
const frame = document.getElementsByTagName("iframe")[0];
iframeURLChange(frame, function (newURL) {
    console.log("URL changed:", newURL);
    let cwd = false;
    setInterval(() => {
        const fel = frames['frame'].document.getElementById('onetrust-consent-sdk');
        if(fel != null){
            try{frames['frame'].document.getElementById('onetrust-accept-btn-handler').click();}catch{}
            setTimeout(() => fel.outerHTML = '', 100);
            cwd = true;
        }
        try{
            const par = frames['frame'].document.getElementsByClassName('frontHero__signin')[0];
            let itms = par.querySelectorAll('button');//header__loginMenu
            try{itms.forEach(el => el.outerHTML = '');}catch{}
            if(itms.length > 0){
                const e1 = document.createElement('a');
                e1.innerHTML = 'Sign in';
                e1.style = 'white-space: nowrap;font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;'+
                'font-weight: 100;text-align: center;vertical-align: baseline;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;'+
                'box-sizing: border-box;font-size: 14px;cursor: pointer;border: 1px solid #e5e5e5;border-radius: 3px;display: inline-block;'+
                'position: relative;transition: opacity .2s linear;background: transparent;color: #fff;border-color: #ccc;height: 30px;'+
                'line-height: 24px;margin: 0 0 0 6px;padding: 2px 15px;';
                par.prepend(e1);
                e1.addEventListener('click', () => OpenLoginPanel());
            }
        }catch{}
        try{
            const par = frames['frame'].document.getElementsByClassName('header__loginMenu')[0];
            let itms = par.querySelectorAll('button');
            try{itms.forEach(el => el.outerHTML = '');}catch{}
            if(itms.length > 0){
                const e1 = document.createElement('a');
                e1.innerHTML = 'Sign in';
                e1.style = '-webkit-appearance: button;font-size: 14px;line-height: 20px;white-space: nowrap;'+
                'font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;'+
                'font-weight: 100;text-align: center;vertical-align: baseline;-webkit-user-select: none;-moz-user-select: none;'+
                '-ms-user-select: none;box-sizing: border-box;cursor: pointer;display: inline-block;position: relative;'+
                'height: 26px;margin: 0;padding: 2px 11px 2px 10px;border: 1px solid #e5e5e5;border-radius: 3px;color: #fff;'+
                'transition: opacity .2s linear;float: left;margin-right: 10px;border-color: #666;background-color: transparent;';
                par.prepend(e1);
                e1.addEventListener('click', () => OpenLoginPanel());
            }
        }catch{}
        try{
            if(frames['frame'].document.body.id != 'DesktopApp'){
                frames['frame'].document.body.id = 'DesktopApp';
                frames['frame'].document.body.addEventListener('click', ()=>{
                    setTimeout(() => {
                        if(!allowCloseLogin) return;
                        window.api.closeLogin();
                    }, 100);
                });
            }
        }catch{}
        try{
            const href = document.getElementsByTagName('iframe')[0].contentWindow.location.href;
            if(href != 'https://soundcloud.com' && href != 'https://soundcloud.com/' && 
            href != 'https://soundcloud.com/discover' && href != 'https://soundcloud.com/discover/') window.localStorage.setItem('LastURL', href);
        }catch{}
    }, cwd ? 2000 : 100);
    AddStyle();
});
function OpenLoginPanel() {
    allowCloseLogin = false;
    setTimeout(() => allowCloseLogin = true, 2000);
    window.api.loginReq();
}
const StyleId = 'BlackStyleDesktopApp';
setTimeout(() => {
    setInterval(() => {
        const _st = frames['frame'].document.getElementById(StyleId);
        if(_st != null) return;
        AddStyle();
    }, 2000);
}, 10000);
function AddStyle() {
    const cssLink = document.createElement("link");
    cssLink.href = "https://cdn.scpsl.store/another/5bf6d0d05eca/scb.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css";
    cssLink.id = StyleId;
    frames['frame'].document.head.appendChild(cssLink);
}