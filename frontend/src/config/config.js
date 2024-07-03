let url;
if (import.meta.env.VITE_ENV === "development") {
  url = String(import.meta.env.VITE_LOCAL_BACKEND_URL);
} else {
  url = String(import.meta.env.VITE_BACKEND_URL);
}

const config = {
  backendUrl: url,
};

export default config;
