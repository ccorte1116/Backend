require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

app.get("/get_data", function (request, response) {
  response.send("1");
});

app.post("/get_data", async function (request, response) {
  console.log(1);

  try {
    console.log(1);

    const scan_page = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
    });

    const databases = scan_page.results.filter((result) => result.object === "database");

    const queryPromises = databases.map(async (database) => {
      const data = await notion.databases.query({
        database_id: database.id,
      });

      const results = data.results;

      return results.map((result) => result.properties).reverse();
    });

    response.send(await Promise.all(queryPromises));
  } catch (error) {
    console.error("Error:", error);
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
