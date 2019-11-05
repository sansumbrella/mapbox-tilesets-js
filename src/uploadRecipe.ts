const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

type Result = {
  error?: string;
  success?: string;
};

/// Upload a JSON tile recipe to the Tilesets API.
/// If the recipe already exists, updates the recipe instead.
export async function uploadRecipe(
    user: string, accessToken: string, recipeData: string,
    name: string): Promise<Result> {
  try {
    const id = `${user}.${name}`;
    const url =
        `https://api.mapbox.com/tilesets/v1/${id}?access_token=${accessToken}`;
    const body = {recipe: recipeData, name: name};
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const text = await response.text();
      return {success: text};
    }
    const text = await response.text();
    if (text.indexOf('already exists') !== -1) {
      // this check feels fragile; is there a consistent, documented response
      // for this state?
      return updateRecipe(id, accessToken, recipeData);
    }
    return {error: text};
  } catch (err) {
    return {error: err.message};
  }
}

/// Update an existing recipe
async function updateRecipe(id, accessToken, recipeData) {
  try {
    const url = `https://api.mapbox.com/tilesets/v1/${id}/recipe?access_token=${
        accessToken}&pluginName=RealtimePOIBlueprint`;
    const body = recipeData;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if (response.ok) {
      const text = await response.text();
      return {success: text};
    }
    const text = await response.text();
    return {error: text};
  } catch (err) {
    return {error: err.message};
  }
}
