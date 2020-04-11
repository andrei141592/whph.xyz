const form = document.querySelector(
  "form"
); /*any time you see document, means that you are on the client side */

const loadingElement = document.querySelector(".loading");

const mewsElement = document.querySelector(".mews");

const API_URL = "http://localhost:5000/mews";

loadingElement.style.display = "";

listAllMews();

loadingElement.style.display = "none";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const mew = {
    name,
    content,
  };
  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(mew),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((createdMew) => {
      listAllMews();
      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 30000);

      loadingElement.style.display = "none";
    });
});

function listAllMews() {
  mewsElement.innerHTML = "";
  fetch(API_URL)
    .then((response) => response.json())
    .then((mews) => {
      mews.reverse();
      mews.forEach((mew) => {
        const div = document.createElement("div");
        const header = document.createElement("h3");
        const date = document.createElement("small");

        header.textContent = mew.name;

        const contents = document.createElement("p");
        contents.textContent = mew.content;
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);
        mewsElement.appendChild(div);
      });
    });
}
loadingElement.style.display = "none";
