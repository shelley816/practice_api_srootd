import View from "./View.js";

class FilterView extends View {
  _parentEl = document.querySelector(".filter");
  _message = "Recipe was successfully uploaded ;)";

  _window = document.querySelector(".filter-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--filter");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._btnHandleClear();
  }

  update(data) {
    // +female+green
    const selectedValues = data.curQuery.split("+").filter(Boolean);

    this._parentEl.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = selectedValues.includes(input.value);
    });
  }

  addHandlerFilter(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const isFilterBtnClicked = e.submitter?.classList.contains("filter__btn");
      if (!isFilterBtnClicked) return;

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      const gender = data.gender ? `+${data.gender}` : "";
      const color = data.color ? `+${data.color}` : "";
      const dataStr = gender + color;

      handler(dataStr);
    });
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  _btnHandleClear() {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".filter__clear");
      if (!btn) return;

      btn
        .closest(".filter")
        .querySelectorAll("input")
        .forEach((input) => {
          input.checked = false;
        });
    });
  }
}

export default new FilterView();
