// inside db/seed.js

// grab our client with destructuring from the export in index.js
const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,
  createTags,
  createPostTag,
  addTagsToPost,
  getPostById,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables....");

    await client.query(`

      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
      
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`

    CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR (255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR (255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
     );
  
      `);
    console.log("Starting to build POSTS table...");

    await client.query(`

    CREATE TABLE posts(
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true 
     );
  
      `);

    console.log("Starting to build tags table...");
    await client.query(`

      CREATE TABLE tags(
        id SERIAL PRIMARY KEY,
        name VARCHAR (255) UNIQUE NOT NULL
       );

        `);
    console.log("Starting to build post_tags table...");
    await client.query(`

        CREATE TABLE post_tags(
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE("postId", "tagId")

         );

          `);

    console.log("Finished building POSTS tables!");
    console.log("Finished building tags table.");
    console.log("Finished building post_tags table.");
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

// new function, should attempt to create a few users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "albert",
      location: "denver",
    });

    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "sandra",
      location: "california",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "glamgal",
      location: "utah",
    });

    // console.log(albert);

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    console.log("Starting to create posts");

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
    });

    await createPost({
      authorId: sandra.id,
      title: "Sandra's First Post",
      content: "This is my first post. I hope it is better than Albert's.",
    });

    await createPost({
      authorId: glamgal.id,
      title: "Glamgal's First Post",
      content: "This is my first post. I hope I don't sound like a ditz.",
    });

    // create posts for sandra glamgal

    console.log("Finsihed creating posts!");
    // a couple more
  } catch (error) {
    throw error;
  }
}

async function createInitialTags() {
  try {
    console.log("Starting to create tags...");

    const [happy, sad, inspo, catman] = await createTags([
      "#happy",
      "#worst-day-ever",
      "#youcandoanything",
      "#catmandoeverything",
    ]);

    const [postOne, postTwo, postThree] = await getAllPosts();

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);

    console.log("Finished creating tags!");
  } catch (error) {
    console.log("Error creating tags!");
    throw error;
  }
}

async function rebuildDB() {
  client.connect();
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    console.log("ID FOR UPDATE USER: ", users[0].id);
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => {
    console.log("about to end the client");
    client.end();
  });
