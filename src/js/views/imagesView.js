import icon from "url:../../img/icons.svg"; // Parcel 2

class ImagesView {
  _parentEl = document.querySelector(".imgsContainer");
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpiner() {
    const markup = `
      <div class="spinner">
        <div class="spinner__space">
        <svg>
          <use href="${icon}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    const [first] = this._data;

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

    const otherMarkup = this._data
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
