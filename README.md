# tilesets-js

A utility library for uploading and tiling data using the Mapbox [Tilesets API](https://docs.mapbox.com/api/maps/#creating-new-tilesets-with-the-tilesets-api).


## Usage

```js
const { TilesetsAPI } = require("@sansumbrella/mapbox-tilesets");

const tilesets = new TilesetsAPI(username, accessToken);
await tilesets.uploadRecipe(recipe, "custom-tileset");
await tilesets.publish(`${username}.custom-tileset`);
```

*Warning*: The data upload endpoint is not idempotent. Every time you upload data, it is appended to your existing source.
