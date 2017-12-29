describe("lib test", function() {
    let lib = require("./lib");
    let longURLs = [
        "http://example.com/",
        "www.example.com",
        "zhihu.com",
        "::1:8080/123",
        "192.168.10.10",
        "[::1]:8080/456",
    ];

    let shortURLs = [];

    it("转换为短网址， 返回 5 位字母、数组混合字符串", async function() {
        for (let long of longURLs) {
            let short = await lib.generate(long);
            expect(short).toMatch(/^[0-9a-zA-Z]{5}$/);
            shortURLs.push(short);
        }
    });

    it("重复转换，返回值相同", async function() {
        for (let long of longURLs) {
            let short1 = await lib.generate(long);
            let short2 = await lib.generate(long);
            expect(short1).toBe(short2);
        }
    });

    it("通过短网址查询原网址", async function() {
        for (let i in longURLs) {
            let long = longURLs[i];
            let short = shortURLs[i];
            expect(await lib.getByShort(short)).toBe(long);
        }
    });

    it("通过原网址查询原网址", async function() {
        for (let i in longURLs) {
            let long = longURLs[i];
            let short = shortURLs[i];
            expect(await lib.getByLong(long)).toBe(short);
        }
    });

    it("保存已存在的短网址，需要返回 false", async function() {
        for (let long of longURLs) {
            let short = await lib.generate(long);
            expect(await lib.save(short, long)).toBe(false);
        }
    });
});