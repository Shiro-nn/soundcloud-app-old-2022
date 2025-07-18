console.log("URL changed:", newURL);
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
        if(href != 'https://soundcloud.com' && href != 'https://soundcloud.com/' && 
        href != 'https://soundcloud.com/discover' && href != 'https://soundcloud.com/discover/') window.cspb_send({type:'LastUrl', href});
    }catch{}
}, cwd ? 2000 : 100);
AddStyle();
const StyleId = 'BlackStyleDesktopApp';
setTimeout(() => {
    setInterval(() => {
        const _st = document.getElementById(StyleId);
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
    document.head.appendChild(cssLink);
}