const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const FormData = require("form-data");

// Opens the specified file and uploads
export async function uploadSource(user, accessToken, stream, name) {
  try {
    const url = `https://api.mapbox.com/tilesets/v1/sources/${user}/${name}?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
    const formData = new FormData();
    formData.append("file", stream);

    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    const text = await response.text();
    if (response.ok) {
      return { success: text };
    }
    return { error: text };
  } catch (err) {
    return { error: err.message };
  }
}

async function uploadSourceCommand(opt) {
  const { data, name, user, accessToken } = opt;
  const stream = fs.createReadStream(path.resolve(data));

  const { error, success } = await uploadSource(user, accessToken, stream, name);
  if (error) {
    console.error("error creating tileset source", error);
  }
  if (success) {
    const json = JSON.parse(success);
    if (json.files > 1) {
      console.log(`added to tileset source ${name}`, success);
    } else {
      console.log(`created tileset source ${name}`, success);
    }
  }
}

if (require.main === module) {
  require("dotenv").config();
  const argv = require("yargs")
    .option("data", {
      describe: "File containing JSON describing recipe",
      demandOption: true
    })
    .option("name", {
      describe: "name for the source",
      demandOption: true
    })
    .option("user", {
      default: process.env.MAPBOX_USER,
      demandOption: !process.env.MAPBOX_USER
    })
    .option("accessToken", {
      default: process.env.MAPBOX_SECRET_TOKEN,
      demandOption: !process.env.MAPBOX_SECRET_TOKEN
    })
    .parse();
  uploadSourceCommand(argv);
}
