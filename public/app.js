/* Let the user type */

const cssTextArea = document.getElementById("css");

cssTextArea.addEventListener("input", () => {
  store();
  updateRenderElement();
});

const htmlTextArea = document.getElementById("html");

htmlTextArea.addEventListener("input", () => {
  store();
  updateRenderElement();
});

/* Let the user validate */

const htmlActions = document.querySelector("#html-head .actions");
htmlActions.addEventListener("click", ({ target }) =>
  validate(target, htmlTextArea.value)
);

const cssActions = document.querySelector("#css-head .actions");
cssActions.addEventListener("click", ({ target }) =>
  validate(target, cssTextArea.value)
);

function validate(targetElement, text) {
  if (targetElement.nodeName !== "BUTTON") {
    return;
  }

  const url = targetElement.getAttribute("data-url");

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then((res) => res.json())
    .then((response) => {
      const errorDiv = document.getElementById("error");
      errorDiv.innerHTML = `<p>
        ${response.join("</p><p>")}
      </p>`;
    })
    .catch(console.error);
}

/* Populate initial data */

const renderIframe = document.getElementById("render");

renderIframe.addEventListener("load", () => {
  retrieve();
  updateRenderElement();
});

/* Talk to the iframe */

function updateRenderElement() {
  const renderEl = document.getElementById("render");

  renderEl.contentWindow.postMessage(
    `<style>${cssTextArea.value}</style>${htmlTextArea.value}`
  );
}

/* Validation Functions */

// function validateHTML() {
//   fetch('/html', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ text: htmlTextArea.value })
//   }).then((response) => {
//     return response.json();
//   }).then((data) => {
//     const htmlErrorDiv = document.getElementById('html-error');

//     htmlErrorDiv.innerHTML = '';

//     data.forEach(({ line, col, message, rule, type }) => {
//       let errorMessageParagraph = document.createElement('p');

//       let errorMessageTypeAndLocation = document.createElement('b');
//       errorMessageTypeAndLocation.innerHTML = `${ type.toUpperCase() } [${ line }:${ col }] `;
//       errorMessageParagraph.appendChild(errorMessageTypeAndLocation);

//       let errorMessageLink = document.createElement('a');
//       errorMessageLink.href = rule.link;
//       errorMessageLink.target = "_blank";
//       errorMessageLink.innerText = message;
//       errorMessageParagraph.appendChild(errorMessageLink);

//       htmlErrorDiv.appendChild(errorMessageParagraph);
//     });
//   }).catch((error) => {
//     console.error(error);
//   });
// }

// function validateCSS() {
//   fetch('/css', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ text: cssTextArea.value })
//   }).then((response) => {
//     return response.json();
//   }).then(({ errors, warnings }) => {
//     const cssErrorDiv = document.getElementById('css-error');

//     cssErrorDiv.innerHTML = '';

//     errors.forEach(({ line, message }) => {
//       let errorMessageParagraph = document.createElement('p');

//       errorMessageParagraph.innerHTML = `<b>ERROR [Line ${ line }]</b> <span>${ message }</span>`;

//       cssErrorDiv.appendChild(errorMessageParagraph);
//     });

//     warnings.forEach(({ line, col, message, rule, type }) => {
//       let warningMessageParagraph = document.createElement('p');

//       warningMessageParagraph.innerHTML = `<b>Warning [Line ${ line }]</b> <span>${ message }</span>`;

//       cssErrorDiv.appendChild(warningMessageParagraph);
//     });
//   }).catch((error) => {
//     console.error(error);
//   });
// }

/* Local Storage Fun */

function store() {
  localStorage.setItem("cssText", cssTextArea.value);
  localStorage.setItem("htmlText", htmlTextArea.value);
}

function retrieve() {
  cssTextArea.value = localStorage.getItem("cssText");
  htmlTextArea.value = localStorage.getItem("htmlText");
}
