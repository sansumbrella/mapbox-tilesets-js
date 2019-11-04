require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { buildRecipe } = require("./buildRecipe");
const { publishTileset } = require("./publishTileset");
const { uploadSource } = require("./uploadSource");
const { uploadRecipe } = require("./uploadRecipe");
const { validateRecipe } = require("./validateRecipe");

/// Combines all necessary steps for creating a tileset.
/// Designed for ease of use at the cost of complexity.
/// Tileset Source and output Tileset will be named similarly:
/// source: `user/tileset`, tiles: `user.tileset`
async function createSampleTileset() {
    const argv = require("yargs")
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .option("user", {
            alias: ["username"],
            default: process.env.MAPBOX_USER,
            demandOption: !process.env.MAPBOX_USER
        })
        .option("cleanSource", {
            alias: ["clean", "src"]
        })
        .option("tilesetName", {
            alias: ["name"],
            default: "custom-tileset"
        })
        .parse();

    const { accessToken, cleanSource } = argv;
    const sourceStream = fs.createReadStream(path.resolve(cleanSource));

    const { user, tilesetName } = argv;
    console.log(`Uploading clean geometries to ${tilesetName}`);
    const sourceName = tilesetName;
    const tilesetID = `${user}.${tilesetName}`;
    const sourced = await uploadSource(user, accessToken, sourceStream, sourceName);
    sourceStream.cleanup && sourceStream.cleanup();
    if (sourced.error) {
        console.error("Error uploading source", sourced.error);
    }
    if (sourced.success) {
        console.log(`Successfully uploaded geometry to ${sourceName}`, sourced.success);
    }

    console.log(`Building and validating recipe ${tilesetName}`);
    const recipe = buildRecipe({ user, sourceName });
    console.log("Generated recipe", JSON.stringify(recipe));
    const validated = await validateRecipe(accessToken, JSON.stringify(recipe));
    if (validated.error) {
        console.error(`Invalid recipe ${validated.error}`);
    }
    if (validated.success) {
        console.log(`Recipe for ${tilesetName} is valid`);
    }

    console.log(`Uploading Recipe`);
    const reciped = await uploadRecipe(user, accessToken, recipe, tilesetName);
    if (reciped.error) {
        console.error(`Error uploading recipe ${reciped.error}`);
    }
    if (reciped.success) {
        console.log("Successfully uploaded recipe");
    }

    console.log(`Publishing Tileset`);
    const published = await publishTileset(accessToken, tilesetID);
    if (published.success) {
        console.log(`Started job to publish ${tilesetID}.\nRun \`node tilesetStatus.js --id ${tilesetID}\` to check progress`, published.success);
    }
    if (published.error) {
        console.error(`Failed to start deploy ${published.error}`);
    }
}

(async function () {
    try {
        createSampleTileset();
    } catch (err) {
        console.error(err);
    }
})();
