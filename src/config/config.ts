// Crate a config object to use API endpoint globally
const config = {
  serverUrl: String(import.meta.env.VITE_API_URL),
};

export default config;
