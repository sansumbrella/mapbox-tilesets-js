const fetch = require("node-fetch");
const FormData = require("form-data");

// Attaches file stream to form and uploads to tilesets API
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
