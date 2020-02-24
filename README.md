# tilesets-js

A utility library for uploading and tiling data using the Mapbox [Tilesets API](https://docs.mapbox.com/api/maps/#creating-new-tilesets-with-the-tilesets-api).


## Usage

```
npm install @sansumbrella/mapbox-tilesets
```

```js
const { TilesetsAPI } = require("@sansumbrella/mapbox-tilesets");

const tilesets = new TilesetsAPI(username, accessToken);
// upload source files
const source = fs.createReadStream(path.resolve(dataFile));
await tilesets.uploadSource(source, "custom-source");
// upload a recipe that uses your source
await tilesets.uploadRecipe(recipe, "custom-tileset");
// create a tileset from your recipe
await tilesets.publish(`${username}.custom-tileset`);
```

*Warning*: The data upload endpoint is not idempotent. Every time you upload data, it is appended to your existing source.
