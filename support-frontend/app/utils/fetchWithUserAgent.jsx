export const fetchWithUserAgent = (url, options = {}) => {
  const customUserAgent = "MinUserAgent/1.0";

  // Ensure headers exist
  const headers = options.headers || {};

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      "User-Agent": customUserAgent, // Add the custom User-Agent
    },
  });
};
