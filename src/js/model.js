import { API_URL } from "./config.js";

const apiKey = process.env.API_ACCESS_KEY;

export const state = {
  imgsUnsplash: {},
};

export const loadImages = async function (kwArr) {
  try {
    const urls = kwArr.map((key) => `${API_URL}/random?query=outfit+${key}`);

    const resArr = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }).then((res) => {
          const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
          console.log(rateLimitRemaining); // 剩餘次數

          if (rateLimitRemaining === 0)
            throw new Error(`${limitMessage} (${res.status})`);
          if (!res.ok) throw new Error(`${errMessage} (${res.status})`);
          return res.json();
        })
      )
    );

    const imgsData = resArr.map((res, index) => {
      const imgData = res;
      return {
        id: imgData.id,
        author: imgData.user.name,
        description: imgData.alt_description,
        color: imgData.color,
        urls: imgData.urls,
        keyword: kwArr[index],
      };
    });
    state.imgsUnsplash = imgsData;
    console.log(state.imgsUnsplash);

    return state.imgsUnsplash;
  } catch (err) {
    console.error(err);
  }
};
