const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'http://soundcloud-reverse1.fydne.dev:5423',
    changeOrigin: true,
    ws: true,
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
app.use(webProxy);
{
    const server = app.listen(80, '127.0.0.1');
    server.on('upgrade', webProxy.upgrade);
}
{
    const server = require('https').createServer({
        key: require('./.crt/sc').key,
        cert: require('./.crt/sc').crt
    }, app);

    server.listen(443, '127.0.0.1');
    server.on('upgrade', webProxy.upgrade);
}
process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err));