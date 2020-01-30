const fetch = require("node-fetch");

async function retrieveGlobalQueueStatus(accessToken) {
    try {
        const url = `https://api.mapbox.com/tilesets/v1/queue?access_token=${accessToken}&pluginName=RealtimeMappingArchitecture`;
        const response = await fetch(url, {
            method: "PUT"
        });
        const text = await response.text();
        if (response.ok) {
            return { success: text };
        } else {
            return { error: text }
        }
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = {
    retrieveGlobalQueueStatus
}

///
/// CLI
///

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("accessToken", {
            demandOption: !process.env.MAPBOX_SECRET_TOKEN,
            default: process.env.MAPBOX_SECRET_TOKEN
        })
        .parse();
    retrieveGlobalQueueStatusCommand(argv);
}

async function retrieveGlobalQueueStatusCommand(argv) {
    const { accessToken } = argv;
    const response = await retrieveGlobalQueueStatus(accessToken);
    console.log(response);
}