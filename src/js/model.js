import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";
import { KEY_WORDS } from "./config.js";

export const state = {
  imgsUnsplash: {},
};

export const loadImages = async function (kwArr, query = "") {
  try {
    const urls = kwArr.map(
      (key) => `${API_URL}/photos/random?query=outfit+${key}${query}`
    );
    const data = await getJSON(urls);
    const imgsData = data.map((img, index) => {
      return {
        id: img.id,
        user: {
          name: img.user.name,
          profileImage: img.user.profile_image,
          link: img.user.links.html,
        },
        alt: img.alt_description,
        description: img.description,
        color: img.color,
        urls: img.urls,
        keyword: KEY_WORDS[index],
      };
    });
    state.imgsUnsplash = imgsData;

    return state;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};
