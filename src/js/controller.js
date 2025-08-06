import "core-js/actual";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import imagesView from "./views/imagesView.js";
import filterView from "./views/filterView.js";
import saveView from "./views/saveView.js";
import weatherView from "./views/weatherView.js";

// if (model.hot) {
//   model.hot.accept();
// }

const controlWeather = async function () {
  try {
    weatherView.renderSpiner(false);

    // Loading weather
    await model.getWeatherData();

    // Rendering weather
    weatherView.render(model.state.weatherInfo);
  } catch (err) {
    weatherView.renderError({ withSpace: false });
  }
};

const controlImages = async function () {
  try {
    imagesView.renderSpiner();

    // Loading images
    await model.loadImages();

    // Rendering images
    imagesView.render(model.state);

    // Updating Saved Images
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

    filterView.update(model.state);

    // Rendering images
    imagesView.render(model.state);
  } catch (err) {
    filterView.renderError();
  }
};

const controlAddSaveImgs = function () {
  // Add/remove saved images
  const isSaved = model.checkIfAllSaved();
  if (!isSaved) model.addSavedImgs(model.state.imgsUnsplash);
  else model.deleteSavedImgs(model.state.imgsUnsplash);

  // Update UI
  imagesView.update(model.state);

  // Render saved images
  saveView.render(model.state);
};

const controlSavedImgs = async function () {
  try {
    saveView.render(model.state);
  } catch (err) {
    saveView.renderMessage();
  }
};

const controlReloadImgs = function (data) {
  model.reloadSavedImgs(data);
  imagesView.render(model.state);
};

const init = function () {
  weatherView.addHendlerRender(controlWeather);
  imagesView.addHandlerRender(controlImages);
  imagesView.addHandlerAddSave(controlAddSaveImgs);
  filterView.addHandlerFilter(controlFilterImages);
  saveView.addHendlerRender(controlSavedImgs);
  saveView.addHandlerClickSaved(controlReloadImgs);
};
init();
