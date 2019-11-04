const fs = require("fs");
const fetch = require("node-fetch");

/// Runs validation against server
async function validateRecipe(accessToken, recipeData) {
    try {
        const url = `https://api.mapbox.com/tilesets/v1/validateRecipe?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: recipeData
        });
        const body = await response.text();
        if (response.ok) {
            const json = JSON.parse(body);
            if (json.valid) {
                return { success: "recipe is valid" };
            }
        };
        return { error: body };
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    validateRecipe
}

///
/// CLI
///

async function validateRecipeCommand(opt) {
    const { recipe, accessToken } = opt;
    try {
        const data = fs.readFileSync(recipe);
        const { error, success } = await validateRecipe(accessToken, data);
        if (error) {
            console.error("Invalid recipe:", error);
        }
        console.log(success);
    } catch (err) {
        console.error(`Error loading recipe from ${recipe}: ${err.message}`);
    }
}

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("recipe", {
            describe: "file containing the recipe in JSON representation",
            demandOption: true
        })
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .parse();
    validateRecipeCommand(argv);
}