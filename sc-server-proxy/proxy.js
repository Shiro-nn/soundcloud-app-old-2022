const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'https://soundcloud.com',
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

const server = app.listen(5423, '127.0.0.1');
server.on('upgrade', webProxy.upgrade);

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err));