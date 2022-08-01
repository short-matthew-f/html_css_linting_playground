/**
 * From https://github.com/microsoft/vscode-htmlhint/blob/main/htmlhint-server/src/server.ts#L37
 * Modified to be 1-indexed
 */
function getRange(error, lines) {

  let line = lines[error.line - 1];
  let isWhitespace = false;
  let curr = error.col;
  
  while (curr < line.length && !isWhitespace) {
      var char = line[curr];
      isWhitespace = (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '<');
      ++curr;
  }

  if (isWhitespace) {
      --curr;
  }

  return {
      start: {
          line: error.line,
          character: error.col
      },
      end: {
          line: error.line,
          character: curr + 1
      }
  };
}

module.exports = {
  getRange
}