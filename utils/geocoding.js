const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getCoordinates = async (location) => {
    const result = await maptilerClient.geocoding.forward(location);
    if (!result.features || result.features.length === 0) {
        throw new Error("Location not found");
    }
    return result.features[0].geometry;
};