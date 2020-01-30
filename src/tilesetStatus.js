const fetch = require("node-fetch");

async function retrieveTilesetStatus(accessToken, id) {
    const url = `https://api.mapbox.com/tilesets/v1/${id}/status?access_token=${accessToken}&pluginName=RealtimeMappingArchitecture`;

    try {
        const response = await fetch(url);
        const text = await response.text();
        if (response.ok) {
            return { success: text };
        } else {
            return { error: text };
        }
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    retrieveTilesetStatus
}

///
/// CLI
///

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("id", {
            alias: ["tileset", "t"],
            describe: "id of tileset to learn about",
            demandOption: true
        })
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .parse();
    retrieveTilesetStatusCommand(argv);
}

async function retrieveTilesetStatusCommand(argv) {
    const { id, accessToken } = argv;
    const { error, success } = await retrieveTilesetStatus(accessToken, id);
    if (error) {
        console.error(error);
    }
    if (success) {
        console.log(success);
    }
}
