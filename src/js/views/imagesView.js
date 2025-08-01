import icon from "url:../../img/icons.svg"; // Parcel 2
import { KEY_WORDS } from "../config";

class ImagesView {
  _parentEl = document.querySelector(".imgsContainer");
  _data;
  _errorMessage = "We couldn't load images, please try again later!";
  _message =
    "Start by clicking the button for some outfit inspiration. Have fun!";

  _btnStar = document.querySelector(".start__btn");

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    this._btnStar.addEventListener("click", function (e) {
      e.preventDefault();
      handler(KEY_WORDS);
    });
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpiner() {
    const markup = `
      <div class="space"></div>
      <div class="spinner">
        <svg>
          <use href="${icon}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="space"></div>
      <div class="error">
        <div>
          <svg>
            <use href="${icon}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="space"></div>
      <div class="message">
        <div>
          <svg>
            <use href="${icon}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    const [first] = this._data.imgsUnsplash;

    const topMarkup = `
      <div class="preview__top">
        <div class="preview__fig">
          <img src="${first.urls.regular}" alt="${first.alt}" />
        </div>
        <div class="preview__info">
          <h2 class="preview__title">${first.keyword}</h2>
          <p class="preview__description">${
            first.description ? first.description : first.alt
          }</p>
        </div>
      </div>
    `;

    const otherMarkup = this._data.imgsUnsplash
      .slice(1)
      .map((img) => {
        return `
        <div class="preview__item">
          <div class="preview__fig">
            <img src="${img.urls.small}" alt="${img.description}" />
          </div>
          <div class="preview__info">
            <h2 class="preview__title">${img.keyword}</h2>
          </div>
        </div>
      `;
      })
      .join("");

    return `
      ${topMarkup}
      <div class="preview__wrap">
        ${otherMarkup}
      </div>
    `;
  }
}

export default new ImagesView();
