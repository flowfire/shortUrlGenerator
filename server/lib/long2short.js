let lib = require("./lib");
module.exports = async(req, res) => {
    let url = req.url.substr(7);
    url = decodeURIComponent(url);
    let short = await lib.generate(url);
    let response = {
        success: true,
        url: short,
        message: "",
    }
    res.setHeader("Content-Type", "Application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.write(JSON.stringify(response));
    res.end();
}