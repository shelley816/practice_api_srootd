import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";
import { KEY_WORDS } from "./config.js";

export const state = {
  imgsUnsplash: [],
  curQuery: "",
  savedImgs: [],
  isAllSaved: false,
};

export const getDateTime = function () {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, "0");
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const strTime = `${year}.${month}.${day} ${hour}:${minute}`;
  return strTime;
};

export const loadImages = async function (kwArr, query = state.curQuery) {
  try {
    // 預設 false
    state.isAllSaved = false;

    state.curQuery = query;
    const urls = kwArr.map(
      (key) => `${API_URL}/photos/random?query=outfit+${key}${query}`
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

    return state;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const addSavedImgs = function (imgsUnsplash) {
  const exists = state.savedImgs.some((saved) =>
    isImgsSetMatch(saved, imgsUnsplash)
  );
  if (exists) return;

  state.savedImgs.push(imgsUnsplash);
  state.isAllSaved = checkIfAllSaved();
};

export const deleteSavedImgs = function (imgsUnsplash) {
  const matchIndex = state.savedImgs.findIndex((saved) =>
    isImgsSetMatch(saved, imgsUnsplash)
  );
  if (matchIndex !== -1) state.savedImgs.splice(matchIndex, 1);

  state.isAllSaved = checkIfAllSaved();
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

function isImgsSetMatch(a, b) {
  if (a.length !== b.length) return false;
  return a.every((img, i) => img.id === b[i].id);
}
