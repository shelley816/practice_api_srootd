import View from "./View.js";
import { SAVED_IMGS_LIMIT } from "../config";

class SaveView extends View {
  _parentEl = document.querySelector(".saved__list");
  _message = "No images yet. Fine a nice inspiration and save it ;)";

  _itemSaved = document.querySelector(".nav__item--saved");
  _btnSaved = document.querySelector(".nav__btn--saved");
  _savedEl = document.querySelector(".saved");

  constructor() {
    super();
    this._savedMenuHandlers();
  }

  addHendlerRender(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerClickSaved(handler) {
    this._parentEl.addEventListener(
      "click",
      function (e) {
        if (e.target.closest('[data-role="saved-toggle"]')) return;

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
        this.hideSaved();
      }.bind(this)
    );
  }

  showSaved() {
    this._btnSaved.classList.add("hoverBg");
    this._savedEl.classList.remove("conceal");
    this._savedEl.classList.add("reveal");
  }

  hideSaved() {
    this._btnSaved.classList.remove("hoverBg");
    this._savedEl.classList.remove("reveal");
    this._savedEl.classList.add("conceal");
  }

  _savedMenuHandlers() {
    const isHoverable = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (isHoverable) {
      // 桌機：用 hover
      this._itemSaved.addEventListener(
        "pointerenter",
        this.showSaved.bind(this)
      );
      this._itemSaved.addEventListener(
        "pointerleave",
        this.hideSaved.bind(this)
      );
    } else {
      // 手機：用點擊切換
      this._itemSaved.addEventListener("click", (e) => {
        // 若點到的是「切換按鈕」就 toggle
        const toggleBtn = e.target.closest('[data-role="saved-toggle"]');
        if (toggleBtn) {
          this._savedEl.classList.contains("reveal")
            ? this.hideSaved()
            : this.showSaved();
        }
      });

      // 點選單外關閉
      document.addEventListener("click", (e) => {
        if (!this._itemSaved.contains(e.target)) this.hideSaved();
      });

      // 避免在選單內點擊就冒泡到 document 而關閉
      this._savedEl.addEventListener("click", (e) => e.stopPropagation(), {
        passive: true,
      });
    }
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
