const fetch = require("node-fetch");

/// Enumerates the tileset sources associated with the giver user
async function listTilesets(user, accessToken) {
    const url = `https://api.mapbox.com/tilesets/v1/${user}?access_token=${accessToken}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            return json.map(source => source.id).join("\n");
        } else {
            const text = await response.text();
            return { error: text };
        }
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    listTilesets
}

///
/// CLI
///

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("user", {
            default: process.env.MAPBOX_USER,
            demandOption: !process.env.MAPBOX_USER
        })
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .parse();
    listTilesetsCommand(argv);
}

async function listTilesetsCommand(argv) {
    const { user, accessToken } = argv;
    const response = await listTilesets(user, accessToken);
    console.log(response);
}
