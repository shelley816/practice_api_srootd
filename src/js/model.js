import { API_UNSPLASH_URL, KEY_WORDS, API_OPENWEATHER_URL } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  imgsUnsplash: [],
  curQuery: "",
  savedImgs: [],
  isAllSaved: false,
  weatherInfo: {},
};

const weatherKey = process.env.API_KEY_WEATHER;

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getWeatherData = async function () {
  try {
    // Gte location
    const pos = await getPosition();
    let { latitude, longitude } = pos.coords;
    latitude = +latitude.toFixed(2);
    longitude = +longitude.toFixed(2);

    // Get weather data
    const url = `${API_OPENWEATHER_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey}`;

    const weatherData = await fetch(url);
    const data = await weatherData.json();

    // Simulated probability of precipitation
    const pop = (() => {
      const desc = data.weather[0].main.toLowerCase();
      const clouds = data.clouds.all;
      const hasRain = data.rain && (data.rain["1h"] || data.rain["3h"]);
      if (hasRain) return 100;
      if (desc.includes("rain") || desc.includes("thunderstorm")) return 90;
      if (desc.includes("drizzle")) return 70;
      if (clouds > 85) return 50;
      if (clouds > 60) return 30;
      return 10;
    })();

    // Simulated UV
    const uv = (() => {
      const clouds = data.clouds.all;
      const desc = data.weather[0].main.toLowerCase();
      const isClear =
        desc.includes("clear") || desc.includes("sun") || clouds < 30;

      return isClear;
    })();

    // for data 2.5
    const weatherInfo = {
      temperature: +data.main.temp.toFixed(1),
      feelsLike: +data.main.feels_like.toFixed(1),
      description: data.weather[0].description,
      iconCode: data.weather[0].icon,
      iconURL: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      pop,
      uv,
    };

    state.weatherInfo = weatherInfo;
  } catch (err) {
    throw err;
  }
};

export const getDateTime = function () {
  const getTowNum = (num) => `${num}`.padStart(2, "0");
  const now = new Date();
  const year = now.getFullYear();
  const month = getTowNum(now.getMonth());
  const day = getTowNum(now.getDate());
  const hour = getTowNum(now.getHours());
  const minute = getTowNum(now.getMinutes());
  const strTime = `${year}.${month}.${day} ${hour}:${minute}`;
  return strTime;
};

export const loadImages = async function (query = state.curQuery) {
  try {
    const kwArr = KEY_WORDS;
    const urlKwArr = kwArr.map((key) => `fashion+${key}`);

    // Adding weather conditions
    let weatherKwArr = urlKwArr;
    if (
      state.weatherInfo.temperature >= 16 &&
      state.weatherInfo.temperature <= 20
    )
      testKw.push("jacket");
    if (state.weatherInfo.temperature < 15) {
      weatherKwArr.push("coat", "scarf");
      kwArr.push("coat", "scarf");
    }
    if (state.weatherInfo.uv) {
      weatherKwArr.push("sunglasses");
      kwArr.push("sunglasses");
    }
    if (state.weatherInfo.pop > 30) {
      weatherKwArr.push("umbrella");
      kwArr.push("umbrella");
    }

    // 預設 false
    state.isAllSaved = false;

    state.curQuery = query;
    const urls = urlKwArr.map(
      (key) => `${API_UNSPLASH_URL}/photos/random?query=${key}${query}`
    );

    const data = await getJSON(urls);
    const imgsData = data.map((img, index) => {
      return {
        id: img.id,
        user: {
          bio: img.user.bio,
          name: img.user.name,
          profileImage: img.user.profile_image,
          link: img.user.links.html,
        },
        alt: img.alt_description,
        description: img.description,
        color: img.color,
        urls: img.urls,
        keyword: KEY_WORDS[index],
        dateTime: getDateTime(),
      };
    });
    state.imgsUnsplash = imgsData;

    checkIfAllSaved();
  } catch (err) {
    throw err;
  }
};

const persistSavedImgs = function () {
  localStorage.setItem("savedImgs", JSON.stringify(state.savedImgs));
};

export const addSavedImgs = function (imgsUnsplash) {
  const exists = state.savedImgs.some((saved) =>
    isImgsSetMatch(saved, imgsUnsplash)
  );
  if (exists) return;

  state.savedImgs.push(imgsUnsplash);
  state.isAllSaved = checkIfAllSaved();

  persistSavedImgs();
};

export const deleteSavedImgs = function (imgsUnsplash) {
  const matchIndex = state.savedImgs.findIndex((saved) =>
    isImgsSetMatch(saved, imgsUnsplash)
  );
  if (matchIndex !== -1) state.savedImgs.splice(matchIndex, 1);

  state.isAllSaved = checkIfAllSaved();

  persistSavedImgs();
};

export function checkIfAllSaved() {
  const currentIds = state.imgsUnsplash.map((img) => img.id);

  const result = state.savedImgs.some((savedSet) => {
    const savedIds = savedSet.map((img) => img.id);
    return (
      currentIds.length === savedIds.length &&
      currentIds.every((id) => savedIds.includes(id))
    );
  });

  state.isAllSaved = result;
  return result;
}

export const reloadSavedImgs = function (data) {
  state.imgsUnsplash = data;
  checkIfAllSaved();
};

function isImgsSetMatch(a, b) {
  if (a.length !== b.length) return false;
  return a.every((img, i) => img.id === b[i].id);
}

const init = function () {
  const storage = localStorage.getItem("savedImgs");
  if (storage) state.savedImgs = JSON.parse(storage);
};
init();
