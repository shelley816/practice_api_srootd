import "core-js/actual";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import imagesView from "./views/imagesView.js";
import filterView from "./views/filterView.js";

// if (model.hot) {
//   model.hot.accept();
// }

const controlImages = async function (kwArr) {
  try {
    imagesView.renderSpiner();

    // Loading images
    await model.loadImages(kwArr);

    // Rendering images
    imagesView.render(model.state);
  } catch (err) {
    imagesView.renderError();
  }
};

const controlFilterImages = async function (kwArr, data) {
  try {
    filterView.toggleWindow();
    imagesView.renderSpiner();

    // Loading images
    await model.loadImages(kwArr, data);

    // Rendering images
    imagesView.render(model.state);
  } catch (err) {
    filterView.renderError();
  }
};

const init = function () {
  imagesView.addHandlerRender(controlImages);
  filterView.addHandlerFilter(controlFilterImages);
};
init();
