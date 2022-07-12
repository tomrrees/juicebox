// inside db/seed.js

// grab our client with destructuring from the export in index.js
const { client, getAllUsers } = require("./index");

async function testDB() {
  try {
    client.connect();

    const users = await getAllUsers();

    console.log(users);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

testDB();
