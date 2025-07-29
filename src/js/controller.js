import { API_URL } from "./config.js";
import icon from "url:../img/icons.svg"; // Parcel 2
import "core-js/actual";
import "regenerator-runtime/runtime";
// import * as model from './model.js';
// import { MODAL_CLOSE_SEC } from './config.js';

// if (model.hot) {
//   model.hot.accept();
// }

// https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY

const apiKey = process.env.API_ACCESS_KEY;
// const keyWords = ["top", "bottom", "jacket", "dress"];
const keyWords = ["top", "bottom"];
const errMessage = "Loading images failed, please try again later!";
const limitMessage = "No more images to load, please try 60 minutes later!";
const imgsContainer = document.querySelector(".imgsContainer");
const btnInspiration = document.querySelector(".start__btn");

const renderSpiner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <div class="spinner__space">
      <svg>
        <use href="${icon}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", markup);
};

const showImages = async function (kwArr) {
  renderSpiner(imgsContainer);

  const urls = kwArr.map(
    (key) => `${API_URL}/random?query=outfit+female+${key}`
  );

  try {
    const resArr = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }).then((res) => {
          const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
          console.log(rateLimitRemaining); // 剩餘次數

          if (rateLimitRemaining === 0)
            throw new Error(`${limitMessage} (${res.status})`);
          if (!res.ok) throw new Error(`${errMessage} (${res.status})`);
          return res.json();
        })
      )
    );

    const data = resArr.map((res, index) => {
      const imgData = res;
      return {
        id: imgData.id,
        author: imgData.user.name,
        description: imgData.alt_description,
        color: imgData.color,
        urls: imgData.urls,
        keyword: kwArr[index],
      };
    });
    const [first] = data;

    const topMarkup = `
      <div class="preview__top">
        <div class="preview__fig">
          <img src="${first.urls.regular}" alt="${first.description}" />
        </div>
        <div class="preview__info">
          <h2 class="preview__title">${first.keyword}</h2>
          <p class="preview__description">${first.description}</p>
        </div>
      </div>
    `;

    const otherMarkup = data
      .slice(1)
      .map((item) => {
        return `
        <div class="preview__item">
          <div class="preview__fig">
            <img src="${item.urls.small}" alt="${item.description}" />
          </div>
          <div class="preview__info">
            <h2 class="preview__title">${item.keyword}</h2>
          </div>
        </div>
      `;
      })
      .join("");

    const combinedMarkup = `
      ${topMarkup}
      <div class="preview__wrap">
        ${otherMarkup}
      </div>
    `;

    imgsContainer.innerHTML = "";
    imgsContainer.insertAdjacentHTML("afterbegin", combinedMarkup);
  } catch (err) {
    console.error(err);
  }
};
showImages(keyWords);

btnInspiration.addEventListener("click", function (e) {
  e.preventDefault();
  showImages(keyWords);
});
