const fs = require("fs");
const path = require("path");
const axios = require("axios");
const blend = require("@mapbox/blend");
const argv = require("minimist")(process.argv.slice(2));
const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const sendCatRequest = (text, width, height, color, size) => {
  return axios.request({
    method: "GET",
    url: `https://cataas.com/cat/says/${text}?width=${width}&height=${height}&color${color}&s=${size}`,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
};

const blendImages = (image1, image2) => {
  blend(
    [
      { buffer: image1.data, x: 0, y: 0 },
      { buffer: image2.data, x: width, y: 0 },
    ],
    {
      width: width * 2,
      height: height,
      format: "jpeg",
    },
    (err, data) => {
      const fileOut = path.join(process.cwd(), `/cat-card.jpg`);
      fs.writeFile(fileOut, data, "binary", (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("The file was saved!");
      });
    }
  );
}

const sendGetRequest = async () => {
  try {
    const req1 = sendCatRequest(greeting, width, height, color, size);
    const req2 = sendCatRequest(who, width, height, color, size);

    const resp1 = await req1;
    console.log(`Received response with status: ${resp1.status}`);
    const resp2 = await req2;
    console.log(`Received response with status: ${resp2.status}`);
    blendImages(resp1, resp2)
  } catch (err) {
    console.error(err);
  }
};

sendGetRequest();
