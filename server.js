// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
const express = require("express");
const app = express();
const fetch = require("node-fetch");

var query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    id
    title {
      english      
    }
    nextAiringEpisode {
        timeUntilAiring
    }
  }
}
`;

// Define our query variables and values that will be used in the query request
var variables = {
  id: 110277,
};

// Define the config we'll need for our Api request
var url = "https://graphql.anilist.co",
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  };

var anime_data;
app.set("view engine", "ejs");
// Make the HTTP Api request

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function handleData(data) {
  anime_data = data;
  console.log(JSON.stringify(data));
}

function handleError(error) {
  alert("Error, check console");
  console.error(error);
}

async function poggy() {
  await fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);
}

app.get("/", (req, res) => {
  poggy();
  // let pog = `${
  //   anime_data.data.Media.title.english
  // } : Next episode airs in ${secondsToDhms(
  //   anime_data.data.Media.nextAiringEpisode.timeUntilAiring
  // )}`;
  let title = anime_data.data.Media.title.english;
  let time = secondsToDhms(
    anime_data.data.Media.nextAiringEpisode.timeUntilAiring
  );
  res.render("index", { title, time });
});

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

app.listen(process.env.PORT || 3000);
