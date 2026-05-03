export function formatContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'None';
  }

  return contents.map((item) => item.name).join(', ');
}

export function buildStatusTone(status) {
  if (!status) {
    return 'neutral';
  }

  if (['delivered', 'complete', 'received', 'success'].some((value) => status.toLowerCase().includes(value))) {
    return 'ok';
  }

  return 'neutral';
}
