const fs = require("fs");
const util = require("util");
const path = require("path");
const axios = require("axios");
const blend = require("@mapbox/blend");
const argv = require("minimist")(process.argv.slice(2));

// add final image destination to global variables
const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
  destination = path.join(process.cwd(), `/cat-card.jpg`),
} = argv;

// separating the request in a new function
const sendCatRequest = (text, width, height, color, size) => {
  return axios.request({
    method: "GET",
    url: `https://cataas.com/cat/says/${text}?width=${width}&height=${height}&color${color}&s=${size}`,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
};

// promisify blend
const promisedBlend = util.promisify(blend);

// separate blending two images in a promise-based function using async/await
const blendImages = async (image1, image2, destination) => {
  const data = await promisedBlend(
    [
      { buffer: image1.data, x: 0, y: 0 },
      { buffer: image2.data, x: width, y: 0 },
    ],
    {
      width: width * 2,
      height: height,
      format: "jpeg",
    }
  );

  fs.promises.writeFile(destination, data, "binary");
  console.log("The file was saved!");
};

// send two cat async requests in parallel
const blendTwoCats = async ({
  greeting,
  who,
  width,
  height,
  color,
  size,
  destination,
}) => {
  try {
    let [resp1, resp2] = await Promise.all([
      sendCatRequest(greeting, width, height, color, size),
      sendCatRequest(who, width, height, color, size),
    ]);
    console.log(`Received response with status: ${resp1.status}`);
    console.log(`Received response with status: ${resp2.status}`);
    await blendImages(resp1, resp2, destination);
  } catch (err) {
    console.error(err);
  }
};

blendTwoCats({ greeting, who, width, height, color, size, destination });
