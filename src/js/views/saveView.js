import View from "./View.js";
import { SAVED_IMGS_LIMIT } from "../config";

class SaveView extends View {
  _parentEl = document.querySelector(".saved__list");
  _errorMessage = "";
  _message = "No images yet. Fine a nice inspiration and save it ;)";

  addHendlerRender(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerClickSaved(handler) {
    this._parentEl.addEventListener(
      "click",
      function (e) {
        const btn = e.target.closest(".saved__field");
        if (!btn) return;

        const id = btn.dataset.id;
        const time = btn.dataset.time;
        const matchedGroup = this._data.savedImgs.find((group) =>
          group.some(
            (img) =>
              img.keyword === "top" && img.id === id && img.dateTime === time
          )
        );
        handler(matchedGroup);
      }.bind(this)
    );
  }

  _generateMarkup() {
    if (this._data.savedImgs.length === 0) throw new Error(this._message);

    const lastFiveGroups = this._data.savedImgs
      .slice(-SAVED_IMGS_LIMIT)
      .reverse();
    const lastFiveWithTop = lastFiveGroups
      .flat()
      .filter((img) => img.keyword === "top");

    return lastFiveWithTop
      .map((result) => {
        const isActive =
          this._data.imgsUnsplash[0]?.id === result.id &&
          this._data.imgsUnsplash[0]?.dateTime === result.dateTime;

        return `
          <li class="saved__field${
            isActive ? " saved__field--active" : ""
          }" data-id="${result.id}" data-time="${result.dateTime}">
              <div class="preview__item">
              <div class="preview__fig">
                  <img src="${result.urls.small}" alt="Test" />
              </div>
              </div>
              <div class="preview__info">
              <h2 class="preview__title">${result.dateTime}</h2>
              <div class="author">
                  <div>
                  <div class="author__img">
                      <img src="${result.user.profileImage.small}" alt="" />
                  </div>
                  <h3 class="author__name">${result.user.name}</h3>
                  </div>
              </div>
              </div>
          </li>
        `;
      })
      .join("");
  }
}

export default new SaveView();
