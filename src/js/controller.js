import "core-js/actual";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import imagesView from "./views/imagesView.js";

import { KEY_WORDS } from "./config.js";
// if (model.hot) {
//   model.hot.accept();
// }

// const keyWords = ["top", "bottom", "jacket", "dress"];
const keyWords = KEY_WORDS;
const errMessage = "Loading images failed, please try again later!";
const limitMessage = "No more images to load, please try 60 minutes later!";
const btnInspiration = document.querySelector(".start__btn");

const controlImages = async function () {
  try {
    imagesView.renderSpiner();

    // Loading images
    await model.loadImages(keyWords);

    // Rendering images
    imagesView.render(model.state.imgsUnsplash);
  } catch (err) {
    console.error(err);
  }
};
// controlImages(keyWords);

btnInspiration.addEventListener("click", function (e) {
  e.preventDefault();
  controlImages(keyWords);
});
