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
  if (location.in_store_only.availability_status !== 'OUT_OF_STOCK' && location.in_store_only.availability_status !== 'NOT_SOLD_IN_STORE') {
    return true;
  }

  return false;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
