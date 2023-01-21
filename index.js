const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const PORT = 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const newspapers = [
  {
    name: "thetimes",
    address: "http://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "http://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/news", (req, res) => {
  res.json(articles);
});

// app.get("/news", (req, res) => {
//   axios
//     .get(newspapers)
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);

//       $('a:contains("climate")', html).each(function () {
//         const title = $(this).text();
//         const url = $(this).attr("href");
//         articles.push({
//           title,
//           url,
//         });
//       });
//       res.json(articles);
//     })
//     .catch((err) => console.log(err));
// });

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
