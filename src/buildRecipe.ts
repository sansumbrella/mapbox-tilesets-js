///
/// Returns a basic JSON Tileset recipe
/// Parameterized on username and sourcename
///
export function buildRecipe(user: string, sourceName: string) {
  return {
    version: 1,
    layers: {
      parking_blocks: {
        source: `mapbox://tileset-source/${user}/${sourceName}`,
        minzoom: 4,
        maxzoom: 22,
        features: {
          attributes: {}
        }
      }
    }
  };
}
