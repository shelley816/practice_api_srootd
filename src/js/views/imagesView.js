import icon from "url:../../img/icons.svg"; // Parcel 2
import View from "./View.js";

import { KEY_WORDS } from "../config";

class ImagesView extends View {
  _parentEl = document.querySelector(".imgsContainer");
  _errorMessage = "We couldn't load images, please try again later!";
  _message =
    "Start by clicking the button for some outfit inspiration. Have fun!";

  _btnStar = document.querySelector(".start__btn");

  addHandlerRender(handler) {
    this._btnStar.addEventListener("click", function (e) {
      e.preventDefault();
      handler(KEY_WORDS);
    });
  }

  _generateMarkup() {
    const [first] = this._data.imgsUnsplash;

    const topMarkup = `
      <div class="preview__top">
        <div class="preview__fig">
          <img src="${first.urls.regular}" alt="${first.alt}" />
        </div>
        <div class="preview__info">
          <div>
            <h2 class="preview__title">${first.keyword}</h2>
            <p class="preview__description">${
              first.description ? first.description : first.alt
            }</p>
            <div class="author">
              <a href="${first.user.link}" target="_blank">
                <div class="author__img">
                  <img src="${first.user.profileImage.small}" alt="${
      first.user.bio
    }" />
                </div>
                <h3 class="author__name">${first.user.name}</h3>
              </a>
            </div>
          </div>
          <div class="saved__icon">
            <button class="nav__btn">
              <svg class="nav__icon">
                <use href="${icon}#icon-star"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    const otherMarkup = this._data.imgsUnsplash
      .slice(1)
      .map((img) => {
        return `
          <div class="preview__item">
            <div class="preview__fig">
              <img src="${img.urls.regular}" alt="${img.alt}" />
            </div>
            <div class="preview__info">
              <h2 class="preview__title">${img.keyword}</h2>
              <div class="author">
                <a href="${img.user.link}" target="_blank">
                  <div class="author__img">
                    <img src="${img.user.profileImage.small}" alt="${img.user.bio}" />
                  </div>
                  <h3 class="author__name">${img.user.name}</h3>
                </a>
              </div>
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
