import fetch from 'node-fetch';

/// Enumerates the tilesets associated with the giver user
export async function listTilesets(user, accessToken): Promise<string[]> {
  const url =
      `https://api.mapbox.com/tilesets/v1/${user}?access_token=${accessToken}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json.map(source => source.id);
    } else {
      const text = await response.text();
      return [text];
    }
  } catch (err) {
    return [err.message];
  }
}
