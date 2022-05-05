import _ from "lodash/fp";
import settings from "./data/settings.json";
import keys from "./computed/keys.json";
import cards from "./computed/cards.json";
import utils from "./data/utils.json";

const latinList = [
  { hun: ["ö", "ő", "ó"], eng: "o" },
  { hun: ["ü", "ű", "ú"], eng: "u" },
  { hun: ["á"], eng: "a" },
  { hun: ["é"], eng: "e" },
  { hun: ["í"], eng: "i" },
];
export const latinize = _.compose(
  _.replace(/[öüóőúűéáí]/g, (x) => {
    return _.find((list) => _.includes(_.toLower(x), list.hun), latinList).eng;
  }),
  _.toLower
);

const searchCardsList = _.map((card) => {
  return {
    nev: latinize(card.nev),
    kepesseg: latinize(card.kepesseg),
    sorszam: card.sorszam,
  };
})(cards);

const fotipus = utils.fotipus;

export function filterCards(search) {
  let found;
  if (search.nev) {
    const words = _.split(",", latinize(search.nev));
    found = _.compose(
      _.map((card) => card.sorszam),
      _.filter((card) => {
        return _.any((word) => {
          const condition = new RegExp(`.*${word}.*`);
          return condition.test(card.nev) || condition.test(card.kepesseg);
        })(words);
      })
    )(searchCardsList);
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
