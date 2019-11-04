#!/usr/bin/env node
import dotenv from "dotenv";
import yargs from "yargs";
import fs from "fs";
import path from "path";
import { TilesetsAPI } from "./index";
import { buildRecipe } from "./buildRecipe";
import { uploadRecipe } from "./uploadRecipe";
import { validateRecipe } from "./validateRecipe";

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
            demandOption: true
          })
          .option("name", {
            alias: ["n"],
            describe: "name for the source",
            type: "string",
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
        console.log(`starting upload of ${file} to ${name}`);
        const { success, error } = await tilesets.uploadSource(stream, name as string);
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
    .command(
      "upload-recipe",
      "upload a Tileset recipe",
      yargs => {
        yargs
          .option("recipe", {
            describe: "Path to a file containing JSON describing recipe",
            demandOption: true,
            type: "string"
          })
          .option("name", {
            describe: "name for the recipe and the tileset it creates",
            demandOption: true,
            type: "string"
          });
      },
      async args => {
        const { recipe, name, username, accessToken } = args;
        const file = path.resolve(recipe as string);
        const recipeData = JSON.parse(fs.readFileSync(file).toString());
        const { success, error } = await uploadRecipe(username!, accessToken!, recipeData, name as string);
        if (success) {
          console.log("successfully uploaded recipe", success);
        }
        if (error) {
          console.error("failed to upload recipe", error);
        }
      }
    )
    .command(
      "stub-recipe",
      "generates a stub recipe for your account",
      yargs => {
        yargs.option("sourceName", {
          alias: ["source", "src", "s"],
          demandOption: true,
          type: "string"
        });
      },
      args => {
        const { username, sourceName } = args;
        const recipe = buildRecipe(username!, sourceName as string);
        console.log(JSON.stringify(recipe));
      }
    )
    .command(
      "validate-recipe",
      "validates recipe against API specification",
      yargs => {
        yargs.option("recipe", {
          describe: "Path to file containing the JSON Tilesets recipe",
          demandOption: true,
          type: "string"
        });
      },
      async args => {
        const { accessToken, recipe } = args;
        try {
          const data = fs.readFileSync(recipe as string);
          const { error, success } = await validateRecipe(accessToken, data);
          if (error) {
            console.error("Invalid recipe:", error);
          }
          console.log(success);
        } catch (err) {
          console.error(`Error loading recipe from ${recipe}: ${err.message}`);
        }
      }
    )
    .parse();
}

main();
