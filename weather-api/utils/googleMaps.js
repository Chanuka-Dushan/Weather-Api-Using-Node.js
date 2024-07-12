
const { createClient } = require('@google/maps');
const { GOOGLE_MAPS_API_KEY } = process.env;
const googleMapsClient = createClient({
  key: GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

async function getCityName(lat, lng) {
  try {
    const response = await googleMapsClient.reverseGeocode({ latlng: { lat, lng }, result_type: 'locality' }).asPromise();
    const cityName = response.json.results[0].address_components[0].long_name;
    return cityName;
  } catch (err) {
    console.error('Error fetching city name:', err);
    return 'Unknown';
  }
}

module.exports = { getCityName };
