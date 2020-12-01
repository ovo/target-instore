import fetch from 'node-fetch';
import { delay, available } from './util/util';
import sendMessage from './util/twitter';

require('dotenv').config();

export default async function init(productCode, zipCode, prevLocations) {
  let locations = [];
  await fetch(`https://api.target.com/fulfillment_aggregator/v1/fiats/${productCode}?key=ff457966e64d5e877fdbad070f276d18ecec4a01&nearby=${zipCode}&limit=20&requested_quantity=1&radius=50&fulfillment_test_mode=grocery_opu_team_member_test`)
    .then((res) => res.json())
    .then((json) => json.products[0].locations.forEach((location) => {
      if (available(location)
        && !prevLocations.some((e) => e.location_id === location.location_id)) {
        locations.push(location);
      }
    }))
    .catch(async (e) => {
      console.log(e);
      await delay(5000);
      return init(productCode, zipCode, prevLocations);
    });
  await Promise.all(locations.map(async (location) => {
    await sendMessage({
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_SECRET,
      recipient: process.env.RECIPIENT,
      message: location.store_name,
    });
  }));

  await delay(5000);

  if (locations.length === 0) {
    locations = prevLocations;
  }

  return init(productCode, zipCode, locations);
}

init(81114595, 60111, []);
