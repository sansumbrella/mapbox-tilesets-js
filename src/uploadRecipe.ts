const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

type Result = {
  error?: string;
  success?: string;
};

/// Upload a JSON tile recipe to the Tilesets API.
/// If the recipe already exists, updates the recipe instead.
export async function uploadRecipe(user, accessToken, recipeData, name): Promise<Result> {
  try {
    const id = `${user}.${name}`;
    const url = `https://api.mapbox.com/tilesets/v1/${id}?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
    const body = {
      recipe: recipeData,
      name: name
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const text = await response.text();
      return { success: text };
    }
    const text = await response.text();
    if (text.indexOf("already exists") !== -1) {
      console.log(text);
      // this check feels fragile; is there a consistent, documented response for this state?
      return updateRecipe(id, accessToken, recipeData);
    }
    return { error: text };
  } catch (err) {
    return { error: err.message };
  }
}

/// Update an existing recipe
async function updateRecipe(id, accessToken, recipeData) {
  try {
    console.log(recipeData);
    const url = `https://api.mapbox.com/tilesets/v1/${id}/recipe?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
    const body = recipeData;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const text = await response.text();
      return { success: text };
    }
    const text = await response.text();
    console.log(response);
    return { error: text };
  } catch (err) {
    return { error: err.message };
  }
}

async function uploadRecipeCommand(opt) {
  const { recipe, name, user, accessToken } = opt;
  const recipeData = JSON.parse(fs.readFileSync(path.resolve(recipe)));
  const { success, error } = await uploadRecipe(user, accessToken, recipeData, name);
  if (success) {
    console.log(success);
  }
  if (error) {
    console.error(error);
  }
}

if (require.main === module) {
  require("dotenv").config();
  const argv = require("yargs")
    .option("recipe", {
      describe: "File containing JSON describing recipe",
      demandOption: true
    })
    .option("name", {
      describe: "name for the recipe and the tileset it creates",
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
  uploadRecipeCommand(argv);
}
