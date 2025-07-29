import "core-js/actual";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import imagesView from "./views/imagesView.js";

import { KEY_WORDS } from "./config.js";
// if (model.hot) {
//   model.hot.accept();
// }

// const keyWords = ["top", "bottom", "jacket", "dress"];
const type = KEY_WORDS;
const errMessage = "Loading images failed, please try again later!";
const limitMessage = "No more images to load, please try 60 minutes later!";
const btnInspiration = document.querySelector(".start__btn");
const btnFilter = document.querySelector(".filter__btn");

const controlImages = async function () {
  try {
    imagesView.renderSpiner();

    // Loading images
    await model.loadImages(type);

    // Rendering images
    imagesView.render(model.state.imgsUnsplash);
  } catch (err) {
    console.error(err);
  }
};
// controlImages(type);

btnInspiration.addEventListener("click", function (e) {
  e.preventDefault();
  controlImages(type);
});

btnFilter.addEventListener("click", function (e) {
  e.preventDefault();
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const color = document.querySelector('input[name="color"]:checked')?.value;

  console.log(`${gender}&color=${color}`);
});
