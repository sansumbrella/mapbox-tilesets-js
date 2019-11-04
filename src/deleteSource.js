const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const FormData = require("form-data");

// Opens the specified file and uploads
async function deleteSource(user, accessToken, name) {
    try {
        const url = `https://api.mapbox.com/tilesets/v1/sources/${user}/${name}?access_token=${accessToken}&pluginName=RealtimePOIBlueprint`;
        const response = await fetch(url, {
            method: "DELETE"
        });
        const text = await response.text();
        console.log(text);
        if (response.ok) {
            return { success: text };
        }
        return { error: text };

    } catch (err) {
        return { error: err.message };
    }
}

async function deleteSourceCommand(opt) {
    const { name, user, accessToken } = opt;

    const { error, success } = await deleteSource(user, accessToken, name);
    if (error) {
        console.error("error deleting tileset source", error);
    }
    if (success) {
        console.log("successfully deleted", success);
    }
}

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("name", {
            describe: "name for the source",
            demandOption: true
        })
        .option("user", {
            default: process.env.MAPBOX_USER,
            demandOption: !process.env.MAPBOX_USER
        })
        .option("accessToken", {
            default: process.env.MAPBOX_SECRET_TOKEN,
            demandOption: !process.env.MAPBOX_SECRET_TOKEN
        })
        .parse();
    deleteSourceCommand(argv);
}