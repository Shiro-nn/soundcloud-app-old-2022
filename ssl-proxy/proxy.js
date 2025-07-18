const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'http://localhost:3128',
    changeOrigin: false,
    ws: true,
    router: {
        'soundcloud.com': 'http://soundcloud.com',
        'api.soundcloud.com': 'http://api.soundcloud.com',
        'soundcloud-upload.s3.amazonaws.com': 'http://soundcloud-upload.s3.amazonaws.com',
    },
    onError: (err, req, res) => {try{
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Proxy error');
    }catch{}},
};
const webProxy = createProxyMiddleware(options);
const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
    try{
        if(req.get("host")?.startsWith('api')){
            res.set('Access-Control-Allow-Origin', '*');
            next();
            return;
        }
    }catch{}
    next();
})
app.use((req, res, next) => {
    req.headers['x-forwarded-for'] = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    next();
})
app.use(webProxy);
{
    const server = require('https').createServer({
        key: require('./.crt/base').key,
        cert: require('./.crt/base').crt
    }, app);

    server.addContext('soundcloud.com', {
        key: require('./.crt/sc').key,
        cert: require('./.crt/sc').crt
    });
    server.addContext('*.soundcloud.com', {
        key: require('./.crt/sc.sub').key,
        cert: require('./.crt/sc.sub').crt
    });
    server.addContext('*.sndcdn.com', {
        key: require('./.crt/sndcdn').key,
        cert: require('./.crt/sndcdn').crt
    });
    server.addContext('soundcloud-upload.s3.amazonaws.com', {
        key: require('./.crt/scuploads').key,
        cert: require('./.crt/scuploads').crt
    });

    server.listen(666);
    server.on('upgrade', webProxy.upgrade);
}
process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));