export function buildTrackingLink({ carrier, trackingNumber, fallback }) {
  const normalizedCarrier = carrier ? carrier.toLowerCase() : '';

  if (trackingNumber && normalizedCarrier.includes('asendia')) {
    return `https://a1.asendiausa.com/tracking/?trackingnumber=${encodeURIComponent(trackingNumber)}`;
  }

  if (fallback) {
    return fallback;
  }

  if (trackingNumber) {
    return `https://parcelsapp.com/en/tracking/${encodeURIComponent(trackingNumber)}`;
  }

  return null;
}
