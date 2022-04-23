import lunr from "lunr";
import stemmer from "lunr-languages/lunr.stemmer.support";
import lang from "lunr-languages/lunr.hu";

stemmer(lunr);
lang(lunr);

var documents = [
  {
    name: "Lunr",
    text: "Van nálatok terasz",
  },
  {
    name: "React",
    text: "Nincsen nálunk terasz",
  },
  {
    name: "Lodash",
    text: "Helló szia szevasz",
  },
];

var idx = lunr(function () {
  this.use(lunr.hu);
  this.ref("name");
  this.field("text");

  documents.forEach(function (doc) {
    this.add(doc);
  }, this);
});

export default function () {
  console.log("***************");
  console.log(idx.search("terasz"));
}
