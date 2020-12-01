export const available = (location) => {
  if (location.order_pickup.availability_status !== 'UNAVAILABLE') {
    return true;
  }
  if (location.curbside.availability_status !== 'UNAVAILABLE') {
    return true;
  }
  if (location.ship_to_store.availability_status !== 'UNAVAILABLE') {
    return true;
  }
  if (location.in_store_only !== 'OUT_OF_STOCK') {
    return true;
  }

  return false;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
