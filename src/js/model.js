import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";
import { KEY_WORDS } from "./config.js";

export const state = {
  imgsUnsplash: {},
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

export const loadImages = async function (kwArr, query = "") {
  try {
    const urls = kwArr.map(
      (key) => `${API_URL}/photos/random?query=outfit+${key}${query}`
    );
    const data = await getJSON(urls);
    console.log(data);
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
    console.log(imgsData);

    return state;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};
