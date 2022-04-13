const express = require("express");
const bodyParser = require("body-parser");
const { encode } = require("html-entities");

// Local checking, pretty decent
const { HTMLHint } = require("htmlhint");

// Local checking, but doesn't catch as many problems
const stylelint = require("stylelint");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.json());

/**
 * To add to the below endpoints you should:
 * 
 * - create a new button in index.html with data-url equal to the endpoint
 * - call the appropriate linter
 * - create an array of inner html values from the response to be passed back
 * - send it back with res.json()
 */

const customRules = {
  "attr-lowercase": true,
  "attr-no-duplication": true,
  "attr-no-unnecessary-whitespace": true,
  "attr-unsafe-chars": true,
  "attr-value-double-quotes": true,
  "attr-whitespace": true,
  "alt-require": true,
  "input-requires-label": true,
  "tags-check": true,
  "tag-pair": true,
  "tag-self-close": true,
  "tagname-lowercase": true,
  "tagname-specialchars": true,
  "src-not-empty": true,
  "id-unique": true,
  "inline-script-disabled": true,
  "space-tab-mixed-disabled": true,
  "spec-char-escape": true
}

app.post("/html_hint", (req, res, next) => {
  const response = HTMLHint.verify(req.body.text, customRules).map(
    ({ line, col, message, rule }) =>
      `Error (Line ${line})<br />${encode(message)} (${rule.id})`
  );

  res.json(response);
});

app.post("/stylelint", (req, res, next) => {
  stylelint
    .lint({
      code: req.body.text,
    })
    .then((resultObject) => {
      const response = resultObject.results
        .map((x) => x.warnings)
        .reduce((prev, next) => [...prev, ...next], [])
        .map(
          ({ line, column, rule, text }) =>
            `Error (Line ${line})<br />${encode(text)}`
        );

      res.json(response);
    });
});

app.listen(PORT, () => {
  console.log("hey, server is up and running!!");
});
