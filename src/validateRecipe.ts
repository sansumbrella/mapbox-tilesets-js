import fetch from "node-fetch";

/// Runs validation against server
export async function validateRecipe(accessToken, recipeData) {
  try {
    const url = `https://api.mapbox.com/tilesets/v1/validateRecipe?access_token=${accessToken}&pluginName=RealtimeMappingArchitecture`;
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
    }
    return { error: body };
  } catch (err) {
    return { error: err.message };
  }
}
