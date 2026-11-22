export let activeProvider = null;
export let activeModel = {};

export function updateProviderSelection(provider, models) {
  activeProvider = provider;
  activeModel = models;
}
