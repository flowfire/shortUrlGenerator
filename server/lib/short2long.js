let lib = require("./lib");
module.exports = async(req, res) => {
    let url = req.url.substr(6);
    let urlHash = url.substr(url.length - 5);
    let long = await lib.getByShort(urlHash);
    let response = {};
    if (!long) {
        response.success = false;
        response.url = "";
        response.message = "数据库中不存在该短网址";
    } else {
        response.success = true;
        response.url = long;
        response.message = "";
    }
    res.setHeader("Content-Type", "Application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.write(JSON.stringify(response));
    res.end();
}