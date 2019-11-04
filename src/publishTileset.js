const fetch = require("node-fetch")

async function publishTileset(accessToken, id) {
    try {
        const url = `https://api.mapbox.com/tilesets/v1/${id}/publish?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
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

module.exports = {
    publishTileset
};

///
/// CLI
///

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("name", {
            describe: "name of recipe to publish. This should be a tileset id with the `username.` prefix omitted.",
            demandOption: true
        })
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .option("username", {
            alias: ["user"],
            default: process.env.MAPBOX_USER,
            demandOption: !process.env.MAPBOX_USER
        })
        .parse();
    publishTilesetCommand(argv);
}

async function publishTilesetCommand(argv) {
    const { name, username, accessToken } = argv;
    const id = `${username}.${name}`;
    const { error, success } = await publishTileset(accessToken, id);
    if (error) {
        console.error(error);
    }
    if (success) {
        console.log(success);
    }
}
