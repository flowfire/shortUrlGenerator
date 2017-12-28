const fs = require("fs");

const MIME = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".ico": "image/x-icon",
    ".png": "image/png",
};

module.exports = async(req, res) => {
    let url = req.url.substr(1);
    let urls = url.split("/");
    urls.every(path => {
        if (path === "..") {
            // 如果请求上级文件返回 403 forbidden 错误 (理论上应该不会有这种请求)
            res.statusCode = 403;
            res.end()
            return false;
        }
    });
    let fileContent;
    try {
        fileContent = fs.readFileSync(`./static/${url}`, "utf-8");
        let extName = "." + url.split(".").pop();
        res.setHeader("Content-Type", MIME[extName]);
    } catch (e) {
        fileContent = fs.readFileSync(`./static/index.html`, "utf-8");
        res.setHeader("Content-Type", MIME[".html"]);
    }
    res.write(fileContent);
    res.end();
}