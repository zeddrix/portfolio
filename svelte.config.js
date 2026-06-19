import adapter from "@sveltejs/adapter-static";

const rawBasePath = process.env.BASE_PATH ?? "";
const base =
  rawBasePath === "" || rawBasePath === "/"
    ? ""
    : rawBasePath.startsWith("/")
      ? rawBasePath.replace(/\/$/, "")
      : `/${rawBasePath.replace(/\/$/, "")}`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      strict: true,
      fallback: "404.html",
    }),
    paths: {
      base,
    },
  },
};

export default config;
