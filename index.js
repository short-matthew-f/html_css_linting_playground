const express = require('express');
const bodyParser = require('body-parser');

const { encode } = require('html-entities');

// Local checking, pretty decent
const { HTMLHint } = require('htmlhint');

// Local checking, but doesn't catch as many problems
const stylelint = require('stylelint');

// Uses a remote call to W3
var validateCss = require('css-validator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/html_hint', (req, res, next) => {
  console.log(HTMLHint.verify(req.body.text))
  const response = HTMLHint.verify(req.body.text)
    .map(({ line, col, message, rule }) => `Error (Line ${ line })<br />${ encode(message) } (${ rule.id })`)
  // This will return an array of error/warning objects
  res.json(response);
});

app.post('/validate_css', (req, res, next) => {
  validateCss({ text: req.body.text }, function (err, data) {
    const response = [...data.errors, ...data.warnings]
      .map(({ line, message, errortype }) => `Error (Line ${ line })<br />${ encode(message) } (${ errortype })`)

    res.json(response);
  });  
});

app.post('/stylelint', (req, res, next) => {
  stylelint.lint({
    code: req.body.text
  }).then(resultObject => {
    const response = resultObject.results
      .map(x => x.warnings)
      .reduce((prev, next) => [...prev, ...next], [])
      .map(({ line, column, rule, text }) => `Error (Line ${ line })<br />${ encode(text) }`)

    res.json(response);
  });
});

app.listen(PORT, () => {
  console.log('hey!');
});