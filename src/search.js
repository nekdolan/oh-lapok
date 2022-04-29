import lunr from "lunr";
import stemmer from "lunr-languages/lunr.stemmer.support";
import lang from "lunr-languages/lunr.hu";

stemmer(lunr);
lang(lunr);

import _ from "lodash/fp";
import settings from "./data/settings.json";
import keys from "./computed/keys.json";
import cards from "./computed/cards.json";
import utils from "./data/utils.json";

var idx = lunr(function () {
  this.use(lunr.hu);
  this.ref("sorszam");
  this.field("nev");
  this.field("kepesseg");

  cards.forEach(function (doc) {
    this.add(doc);
  }, this);
});

const fotipus = utils.fotipus;

export function filterCards(search) {
  let found;
  if (search.nev) {
    const nev = _.compose(
      _.join(" "),
      _.map((part) => "+" + part),
      _.split(" ")
    )(search.nev);
    found = _.compose(
      _.uniq,
      _.map("ref"),
      _.flatten
    )([idx.search(nev), idx.search(`*${nev}*~1`)]);
  }
  return _.reject(function (card) {
    return _.find(function (setting) {
      const filter = setting.filter;
      const valueKey = filter.keys ? filter.keys : search[setting.key];
      const value =
        filter.keep || valueKey === "pajzs"
          ? valueKey
          : _.isArray(valueKey)
          ? _.map((key) => keys[key], valueKey)
          : keys[valueKey];
      if (!value || _.isEmpty(value)) {
        return false;
      }
      if (!search[setting.key] || _.isEmpty(search[setting.key])) {
        return false;
      }
      const cardValue = card[setting.key];
      const combined = ["fotipus", "altipus"];
      let range, partitionedValues;
      switch (filter.type) {
        case "text":
          return !_.includes(card.sorszam, found);
        case "multiple":
          return !_.includes(cardValue, value);
        case "single":
          return _.toLower(cardValue) !== _.toLower(value);
        case "range":
          range = _.sortBy((val) => val, value);
          if (setting.replace) {
            const replacedValue = setting.replace[range[0]];
            if (replacedValue) {
              if (cardValue === replacedValue) {
                return false;
              }
            }
          }
          return !(cardValue >= range[0] && cardValue <= range[1]);
        case "mesh":
          return !_.any((setValue) => {
            const [fo, al] = _.split("_", setValue);
            const [cfo, cal] = _.map((tipus) => {
              return _.compose(
                _.replace(/é/g, "e"),
                _.replace(/á/g, "a"),
                _.toLower
              )(tipus);
            })([card.fotipus, card.altipus]);
            return cfo === fo && (cal === al || (!cal && !al));
          }, search[setting.key]);
        case "combined":
          partitionedValues = _.partition((value) => {
            return _.includes(value, fotipus);
          }, search[setting.key]);
          return !_.every(
            (index) => {
              const searchValues = partitionedValues[index];
              const type = combined[index];
              const cardValue = card[type];
              const values = _.map((value) => keys[value])(searchValues);
              if (_.isEmpty(searchValues)) {
                return true;
              }
              return _.includes(cardValue, values);
            },
            [0, 1]
          );
      }
      return false;
    }, settings);
  })(cards);
}
