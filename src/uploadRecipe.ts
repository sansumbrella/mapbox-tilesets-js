const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

type Result = {
  error?: string;
  success?: string;
};

/// Upload a JSON tile recipe to the Tilesets API.
/// If the recipe already exists, updates the recipe instead.
export async function uploadRecipe(
  user: string,
  accessToken: string,
  recipeData: string,
  name: string
): Promise<Result> {
  try {
    const id = `${user}.${name}`;
    const url = `https://api.mapbox.com/tilesets/v1/${id}?access_token=${accessToken}`;
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
    console.log(url, response);
    const text = await response.text();
    if (text.indexOf("already exists") !== -1) {
      console.log(text);
      // this check feels fragile; is there a consistent, documented response for this state?
      return updateRecipe(id, accessToken, recipeData);
    }
    console.log("weird", text);
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
