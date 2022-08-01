const { readFileSync } = require('fs');

const express = require("express");
const bodyParser = require("body-parser");
const { encode } = require("html-entities");

// To compute first and last lines and columns for errors
const { getRange } = require('./utils.js');

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

const { Linter } = require("eslint");
const linter = new Linter();
const eslintRules = require('./eslint.config.js');

app.post("/eslint", (req, res, next) => {
  const response = linter.verify(req.body.text, eslintRules).map(({ line, column, severity, fatal, message }) => `ERROR (Severity: ${ severity }${ fatal ? ', fatal' : ''}) Line ${ line }, Column ${ column }\n${ message }`);
  res.json(response);
});

/**
 * If you want to change the HTMLHint Rules, edit .htmlhintrc
 */
const customHTMLHintRules = JSON.parse(readFileSync('./.htmlhintrc'))

app.post("/html_hint", (req, res, next) => {
  const { text } = req.body;

  const response = HTMLHint.verify(req.body.text, customHTMLHintRules).map(
    (error) => {
      // Looks like: { start: { line: 8, character: 4 }, end: { line: 8, character: 23 } }
      const { start, end } = getRange(error, text.split('\n'));

      const { type, message, rule } = error;
      return `${ type.toUpperCase() } [LINE ${ start.line } : COL ${ start.character } - LINE ${ end.line } : COL ${ end.character }]<br />${encode(message)} (${rule.id})`;
    });

  res.json(response);
});

/**
 * If you want to change the Stylelint rules, edit .stylelintrc.json
 */
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
          ({ line, severity, text }) =>
            `${ severity.toUpperCase() } (Line ${line})<br />${encode(text)}`
        );

      res.json(response);
    });
});

app.listen(PORT, () => {
  console.log("hey, server is up and running!!");
});
