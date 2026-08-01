const bcrypt = require("bcrypt");

async function test() {
    const hash = await bcrypt.hash("password123", 10);
    console.log(hash);
}

test();