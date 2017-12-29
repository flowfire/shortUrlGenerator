let lib = require("./lib");
module.exports = async(req, res) => {
    let short = req.url.substr(1);
    let long = await lib.getByShort(short);
    if (!long) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write("该网址不存在，<a href='/'>点此跳转到首页</a>");
        res.end();
    } else {
        if (!long.startsWith("http://") && !long.startsWith("https://") && !long.startsWith("//")) long = "//" + long;
        res.statusCode = 301;
        res.setHeader("Location", long);
        res.end();
    }
}