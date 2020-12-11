import fetch from 'node-fetch';
import { delay, available } from './util/helpers';
import {
  webhook, zipCode, skus, delayTime,
} from './util/config';
import sendWebhook from './util/discord';

export default async function init(sku, prevLocations) {
  const locationResp = await await fetch(`https://api.target.com/fulfillment_aggregator/v1/fiats/${sku}?key=ff457966e64d5e877fdbad070f276d18ecec4a01&nearby=${zipCode}&limit=20&requested_quantity=1&radius=50&fulfillment_test_mode=grocery_opu_team_member_test`);

  if (!locationResp.ok) {
    return init(sku, prevLocations);
  }

  const locationJson = await locationResp.json();
  const { locations } = locationJson.products[0];

  if (prevLocations.length === 0) {
    return init(sku, locations);
  }

  for (const location of locations) {
    const previousLocation = prevLocations.find((l) => l.location_id === location.location_id);

    if (available(previousLocation) !== available(location)) {
      console.log(`Status change at ${location.store_name}: https://target.com/p/A-${sku}`);
      await sendWebhook({
        webhook,
        message: `Status change at ${location.store_name}: https://target.com/p/A-${sku}`,
      });
    }
  }

  await delay(delayTime);

  return init(sku, locations);
}

console.log('Monitor started');
skus.forEach((sku) => init(sku, []));
