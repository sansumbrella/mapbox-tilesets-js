import fetch from "node-fetch";

export async function publishTileset(accessToken, id) {
  try {
    const url = `https://api.mapbox.com/tilesets/v1/${id}/publish?access_token=${accessToken}&pluginName=RealtimeMappingArchitecture`;
    const response = await fetch(url, {
      method: "POST"
    });
    const text = await response.text();
    if (response.ok) {
      return { success: text };
    } else {
      return { error: text };
    }
  } catch (err) {
    return { error: `failed to start publishing job: ${err.message}` };
  }
}
