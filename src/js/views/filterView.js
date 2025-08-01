import icon from "url:../../img/icons.svg"; // Parcel 2
import { KEY_WORDS } from "../config";

class FilterView {
  _parentEl = document.querySelector(".filter");
  _message = "Recipe was successfully uploaded ;)";

  _window = document.querySelector(".filter-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--filter");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    // super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._btnHandleClear();
  }

  render() {
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerFilter(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      const isFilterBtnClicked = e.submitter?.classList.contains("filter__btn");
      if (!isFilterBtnClicked) return;

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      if (!data.gender && !data.color) return;

      const gender = data.gender ? `+${data.gender}` : "";
      const color = data.color ? `+${data.color}` : "";
      const dataStr = gender + color;

      handler(KEY_WORDS, dataStr);
    });
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      "click",
      function () {
        this.toggleWindow();
        this.render();
      }.bind(this)
    );
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

  _clear() {
    this._parentEl.innerHTML = "";
  }

  renderSpiner() {
    const markup = `
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
    return `
        <div class="filter__column">
            <h3 class="filter__heading">Gender</h3>
            <label><input type="radio" name="gender" value="male" /> Male</label>
            <label><input type="radio" name="gender" value="female" /> Female</label>
        </div>
        <div class="filter__column">
            <h3 class="filter__heading">Color</h3>
            <label><input type="radio" name="color" value="black" /> Black</label>
            <label><input type="radio" name="color" value="white" /> White</label>
            <label><input type="radio" name="color" value="yellow" /> Yellow</label>
            <label><input type="radio" name="color" value="orange" /> Orange</label>
            <label><input type="radio" name="color" value="magenta" /> Magenta</label>
            <label><input type="radio" name="color" value="red" /> Red</label>
            <label><input type="radio" name="color" value="green" /> Green</label>
            <label><input type="radio" name="color" value="blue" /> Blue</label>
        </div>

        <div class="filter__btns">
            <button class="btn btn__grey filter__clear">
                <svg>
                <use href="${icon}#icon-funnelX"></use>
                </svg>
                <span>clear</span>
            </button>
            <button class="btn filter__btn">
                <svg>
                <use href="${icon}#icon-funnel"></use>
                </svg>
                <span>filter</span>
            </button>
        </div>
    `;
  }
}

export default new FilterView();
