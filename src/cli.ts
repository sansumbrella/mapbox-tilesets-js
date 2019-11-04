import dotenv from "dotenv";
import yargs from "yargs";
import { TilesetsAPI } from "./index";
import fs from "fs";
import path from "path";

function main() {
  dotenv.config();
  const argv = yargs
    .option("username", {
      alias: ["u"],
      default: process.env.MAPBOX_USER,
      demandOption: !process.env.MAPBOX_USER,
      type: "string"
    })
    .option("accessToken", {
      alias: ["token", "key", "k"],
      default: process.env.MAPBOX_SECRET_TOKEN,
      demandOption: !process.env.MAPBOX_SECRET_TOKEN,
      type: "string"
    })
    .command(
      "upload-source",
      "upload a newline-delimited GeoJSON file",
      yargs => {
        yargs
          .option("data", {
            alias: ["file", "d", "f"],
            describe: "Path to a file containing newline-delimited GeoJSON",
            type: "string",
            default: "string",
            demandOption: true
          })
          .option("name", {
            alias: ["n"],
            describe: "name for the source",
            type: "string",
            default: "string",
            demandOption: true
          });
      },
      async args => {
        const { username, accessToken, data, name } = args;
        const tilesets = new TilesetsAPI(username!, accessToken!);
        const file = path.resolve(data as string);
        if (!fs.existsSync(file)) {
          console.error(`No file found for upload at path: ${file}`);
          return 1;
        }
        const stream = fs.createReadStream(file);
        console.log("starting upload");
        const { success, error } = await tilesets.uploadSource(stream, name as string);
        console.log("finished");
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
        console.log("finished upload");
      }
    )
    .parse();
}

main();
