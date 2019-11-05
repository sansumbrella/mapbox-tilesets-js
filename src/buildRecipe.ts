///
/// Returns a basic JSON Tileset recipe
/// Parameterized on username and sourcename
///

interface Params {
  user: string;
  sourceName: string;
  layerName: string;
}

export function buildRecipe(params: Params) {
  const {user, sourceName, layerName} = params;
  return {
    version: 1, layers: {
      [layerName]: {
        source: `mapbox://tileset-source/${user}/${sourceName}`,
        minzoom: 4,
        maxzoom: 22,
        features: {attributes: {allowed_output: []}}
      }
    }
  }
};
