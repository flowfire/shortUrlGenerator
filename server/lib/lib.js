const monk = require("monk");
const db = monk("localhost/shorturl");
const hm = db.get("hashmap");
const crypto = require("crypto");

const hash = (() => {
    const MAX = Math.pow(62, 5) - 1;

    let dic = [];
    for (let i = 0; i < 10; i++) {
        // 数字
        dic.push("" + i);
    }
    for (let i = 65; i < 91; i++) {
        // 大写字母
        dic.push(String.fromCodePoint(i));
    }
    for (let i = 97; i < 123; i++) {
        // 小写字母
        dic.push(String.fromCodePoint(i));
    }

    // 转化为十进制
    let toDecimal = (str) => {
        let strs = str.split("");
        let num = 0;
        strs.forEach(str => {
            num *= 62;
            num += dic.indexOf(str);
        });
        return num;
    };

    // 从十进制数字转化为字符
    let fromDecimal = (num) => {

        // 如果超出，则随机生成一个
        if (num >= MAX) num = Math.floor(Math.random() * MAX);

        let strs = [];
        while (num) {
            let index = num % 62;
            let str = dic[index];
            strs.unshift(str);
            num = Math.floor(num / 62);
        }
        let str = strs.join("");
        str = str.padStart(5, "0");
        return str;
    };
    return {
        generate(url) {
            let md5 = crypto.createHash("md5");
            md5.update(url);
            let hex = md5.digest("hex");
            let hex1 = hex.substr(0, 7);
            let hex2 = hex.substr(8, 7);
            let hex3 = hex.substr(16, 7);
            let hex4 = hex.substr(24, 7);
            let count = [hex1, hex2, hex3, hex4].reduce((sum, hex) => sum + parseInt(hex, 16), 0);
            let short = fromDecimal(count);

            return short;
        },
        next(short) {
            if (short === "zzzzz") return "00000";
            return fromDecimal(toDecimal(short) + 1);
        }
    }
})();

module.exports = {
    async getByShort(short) {
        let result = await hm.find({
            short: short
        });
        if (result.length === 0) return false;
        return result[0].long;
    },
    async getByLong(long) {
        let result = await hm.find({
            long: long
        });
        if (result.length === 0) return false;
        return result[0].short;
    },
    async save(short, long) {
        let existed = await hm.find({
            short: short
        });
        if (existed.length !== 0) return false;

        let result = await hm.insert({
            short: short,
            long: long,
        });

        return true;
    },
    async generate(long) {
        let short = await this.getByLong(long);
        if (short) return short;
        else short = hash.generate(long);

        while (!await this.save(short, long)) {
            // 如果失败，则循环更新。 不考虑存储满的问题
            short = hash.next(short);
        }
        return short;
    }
}