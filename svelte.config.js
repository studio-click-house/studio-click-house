import nodeAdapter from "@sveltejs/adapter-node";
import vercelAdapter from "@sveltejs/adapter-vercel";

const adapter = process.env.VERCEL === "1" ? vercelAdapter() : nodeAdapter();

/** @type {import("@sveltejs/kit").Config} */
const config = {
  kit: {
    adapter,
  },
};

export default config;
