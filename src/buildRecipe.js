
///
/// Returns a JSON Tileset recipe suitable for rendering Seattle parking on a Mapbox map
/// Parameterized on username and sourcename
///
function buildRecipe({ user, sourceName }) {
    return {
        "version": 1,
        "layers": {
            "parking_blocks": {
                "source": `mapbox://tileset-source/${user}/${sourceName}`,
                "minzoom": 8,
                "maxzoom": 16,
                "features": {
                    "id": {
                        "attribute_id": "OBJECTID"
                    },
                    "attributes": {
                        "allowed_output": ["OBJECTID", "BLOCK_ID", "matched", "restrictions", "side_offset", "SIDE"],
                        "set": {
                            "restrictions": [
                                "match", ["get", "PARKING_CA"],
                                "Unrestricted Parking", 0,
                                "Paid Parking", 2,
                                "Time Limited Parking", 4,
                                "Restricted Parking Zone", 6,
                                "Carpool Parking", 8,
                                "No Parking Allowed", 10,
                                "None", 11,
                                12
                            ],
                            "side_offset": [
                                "match", ["get", "SIDE"],
                                "N", -1,
                                "S", 1,
                                "W", -1,
                                "E", 1,
                                "NE", -1,
                                "SW", 1,
                                "NW", -1,
                                "SE", 1,
                                0
                            ]
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    buildRecipe
}

///
/// CLI
///

if (require.main === module) {
    require("dotenv").config();
    const argv = require("yargs")
        .option("user", {
            describe: "Mapbox account username",
            demandOption: !process.env.MAPBOX_USER,
            default: process.env.MAPBOX_USER
        })
        .option("source", {
            describe: "name of tileset source that provides data",
            demandOption: true
        })
        .parse();
    console.log(JSON.stringify(buildRecipe(argv)));
}
