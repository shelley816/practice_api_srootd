import { TIMEOUT_SEC } from "./config.js";

const apiKey = process.env.API_ACCESS_KEY;
const errMessage = "Loading images failed, please try again later!";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (urls) {
  try {
    const resArr = await Promise.all(
      urls.map(async (url) => {
        const fetchPro = fetch(url, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        });
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

        if (!res.ok) throw new Error(`${errMessage} (${res.status})`);

        const data = await res.json();
        return data;
      })
    );
    return resArr;
  } catch (err) {
    throw err;
  }
};
