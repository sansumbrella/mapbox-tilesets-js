# Data Preparation

A collection of scripts for basic formatting, cleaning, and uploading of data to Mapbox. Read more about the [Tilesets API](https://docs.mapbox.com/api/maps/#creating-new-tilesets-with-the-tilesets-api) and the [Map Matching API](https://docs.mapbox.com/api/navigation/#map-matching) in their online documentation.

## Usage

The `makeTileset.js` script combines all the steps needed to create a working tileset. First ensure you have configured your `.env` file with a secret key that has scope for reading, writing, and listing tilesets. If you don't, you will be prompted to include those parameters as command-line flags when you run the script.

To make a tileset with that script using default options and sample data, run the following command defined in [package.json](./package.json).

```
ogr2ogr -f "GeoJSONSeq" seattle-blocks.ndjson Blockface.shp
```

```
npm run upload-sample-data
```

The script performs the following steps:
2) [Upload clean data](./uploadSource.js) as a TilesetSource
3) [Create a recipe](./buildRecipe.js) referencing the uploaded source
4) [Upload the recipe](./uploadRecipe.js)
5) [Publish the recipe](./publishTileset.js) as a Tileset

Each step is also runnable individually from its corresponding script.

*Warning*: The data upload portion of this script is not idempotent. Every time you upload data, it is appended to your existing source.

### Command Line Interface

Each script is runnable through a [yargs-based](https://yargs.js.org/) command-line-interface. You can learn more about the options for each script at the command line.
```
node <script>.js --help
```

## Data Source
Blockfaces for parking data were acquired from [Seattle GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/blockface) on September 13, 2019.
