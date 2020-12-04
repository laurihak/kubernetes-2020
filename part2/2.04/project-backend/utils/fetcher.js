const axios = require("axios");
const fs = require("fs");
const schedule = require("node-schedule");
const paths = require("./filepath");
const API_URL_PHOTOS = "https://picsum.photos/1200";

schedule.scheduleJob("* * 0 * * *", function () {
  console.log("fetching new image for today :)");
  fetchImageFromWeb();
});

const mkdir = () => {
  try {
    fs.mkdirSync(paths.pathDir, { recursive: true });
  } catch (e) {
    console.log("mkdir error: ", e.message);
  }
};

const fetchImageFromWeb = async () => {
  try {
    const response = await axios.get(API_URL_PHOTOS, {
      responseType: "stream",
    }); 
    response.data.pipe(fs.createWriteStream(paths.pathImage));
  } catch (e) {
      console.log('fetch web image error: ', e.message);
  }
};

const fetchImage = () => {
  let response = undefined;
  try {
    response = fs.readFileSync(paths.pathImage);
  } catch (e) {
    mkdir();
    fetchImageFromWeb();
    console.log("logs error: ", e.message);
  }
  return response;
};

module.exports = {
  fetchImage,
};
