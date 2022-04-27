const fs = require("fs");
const path = require("path");
const csv = require("@fast-csv/parse");
const headers = require("./data/utils.json").headers;
const _ = require("lodash/fp");
const settings = require("./data/settings.json");

function colllectKeys() {
  return _.reduce(function (sum, setting) {
    const options = setting.props.options;
    if (!options) {
      return sum;
    }
    const newSum = { ...sum };
    _.forEach((option) => {
      newSum[option.value || option.key] = option.label;
      if (option.children) {
        _.forEach((child) => {
          newSum[child.key] = child.label;
        })(option.children);
      }
    })(options);
    return newSum;
  }, {})(settings);
}

fs.writeFileSync(
  path.resolve(__dirname, "computed", "keys.json"),
  JSON.stringify(colllectKeys(), null, 2)
);

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
