import fetch from "node-fetch";

/// Enumerates the tileset sources associated with the giver user
export async function listSources(user, accessToken) {
    const url = `https://api.mapbox.com/tilesets/v1/sources/${user}?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
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

async function listSourcesCommand(argv) {
    const { accessToken, user } = argv;
    const response = await listSources(user, accessToken);
    console.log(response);
}

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("accessToken", {
            demandOption: !process.env.MAPBOX_SECRET_TOKEN,
            default: process.env.MAPBOX_SECRET_TOKEN
        })
        .option("user", {
            demandOption: !process.env.MAPBOX_USER,
            default: process.env.MAPBOX_USER
        })
        .parse();
    listSourcesCommand(argv);
}