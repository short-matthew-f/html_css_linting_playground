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

/* Local Storage Fun */

function store() {
  localStorage.setItem("cssText", cssTextArea.value);
  localStorage.setItem("htmlText", htmlTextArea.value);
}

function retrieve() {
  cssTextArea.value = localStorage.getItem("cssText");
  htmlTextArea.value = localStorage.getItem("htmlText");
}
