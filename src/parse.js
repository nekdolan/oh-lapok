const fs = require("fs");
const path = require("path");
const csv = require("@fast-csv/parse");

const headers = [
  "kiskep",
  "forras",
  "nagykep",
  "kiegeszito",
  "nev",
  "ritkasag",
  "szint",
  "fotipus",
  "altipus",
  "kaszt",
  "sorszam",
  "illusztrator",
  "sebzestipus",
  "sebzes",
  "pancel",
  "kepesseg",
  "felszerelheto",
  "specialis",
];

const target = fs.createWriteStream(
  path.resolve(__dirname, "computed", "cards.json")
);

const res = [];

fs.createReadStream(path.resolve(__dirname, "data", "cards.csv"))
  .pipe(csv.parse({ headers }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => res.push(row))
  .on("end", (rowCount) => {
    target.write(JSON.stringify(res, null, 2));
    console.log(`Parsed ${rowCount} rows`);
  });
