import fetch from 'node-fetch';

/// Enumerates the tileset sources associated with the giver user
export async function listSources(user, accessToken): Promise<string[]> {
  const url = `https://api.mapbox.com/tilesets/v1/sources/${
      user}?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json.map(source => source.id);
    } else {
      const text = await response.text();
      return [`error: ${text}`];
    }
  } catch (err) {
    return [`error: ${err.message}`];
  }
}
