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

// we left off here, after adding the code from box number 2
// on the step called " write some helper functions". We got an error code
// after running this command in the terminal : npm run seed:dev

// > juicebox@1.0.0 seed:dev
// > nodemon ./db/seed.js

// sh: nodemon: command not found
