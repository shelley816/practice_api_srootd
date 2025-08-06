import View from "./View.js";

class WeatherView extends View {
  _parentEl = document.querySelector(".weather");
  _errorMessage = "Failed to load data!";

  addHendlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return `
      <div class="weather__icon">
        <img src="${this._data.iconURL}" alt="Weather icon" />
      </div>
      <div class="weather__description">
        <p>${this._data.temperature} <span>°C</span></p>
        <p>${this._data.description}</p>
      </div>
    `;
  }
}

export default new WeatherView();
