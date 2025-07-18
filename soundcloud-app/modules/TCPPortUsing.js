'use strict';
const net = require('net');
module.exports = function(port, host) {
    return new Promise(resolve => {
        const client = new net.Socket();

        function cleanUp() {
            if (client) {
                client.removeAllListeners('connect');
                client.removeAllListeners('error');
                client.removeAllListeners();
                client.end();
                client.destroy();
                client.unref();
            }
        }
    
        client.on('connect', () => {
            CR(true);
            cleanUp();
        });
        client.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') CR(false);
            else CR(true);
            cleanUp();
        });
        
        client.connect(port, host, () => CR(true));

        let alr = false;
        function CR(bool) {
            if(alr) return;
            alr = true;
            resolve(bool);
        }
    });
}