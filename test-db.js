const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "oms_framework",
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected!");

    const res = await client.query("SELECT version()");
    console.log(res.rows[0]);

    await client.end();
  } catch (err) {
    console.error(err);
  }
})();