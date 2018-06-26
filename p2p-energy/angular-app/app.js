const cfenv = require('cfenv');
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const proxy = require('http-proxy-middleware');
const proxyConfig = require('./proxy.conf.js');

const app = express();
const appEnv = cfenv.getAppEnv();
const server = http.createServer(app);

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) {
    console.error('no dist directory - try running "npm run build" first');
    process.exit(1);
}
const static = express.static(dist);

app.use(static);

proxyConfig.forEach((element) => {
    const context = element.context;
    delete element.context;
    const proxyMiddleware = proxy(context, element);
    app.use(function (req, res, next) {
        const bypass = typeof element.bypass === 'function';
        const bypassUrl = bypass && element.bypass(req, res, element) || false;
        if (bypassUrl) {
            req.url = bypassUrl;
            return static(req, res, next);
        } else {
            return proxyMiddleware(req, res, next);
        }
    });
});

server.listen(appEnv.port, function () {
    console.log('server starting on ' + appEnv.url);
});