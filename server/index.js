let http = require("http");
http.createServer((req, res) => {
    let url = req.url;
    url = url.substr(1);

    switch (true) {
        case /^[0-9a-zA-Z]{5}$/.test(url):

            // 跳转请求
            require("./lib/redirect")(req, res);
            break;

        case /^short\/.+$/.test(url):

            // 请求将长网址转换为短网址
            require("./lib/long2short")(req, res);
            break;

        case /^long\/.+$/.test(url):

            // 请求将短网址还原为长网址
            require("./lib/short2long")(req, res);
            break;

        default:
            // 其他请求
            require("./lib/static")(req, res);
            break;
    }
}).listen(80);