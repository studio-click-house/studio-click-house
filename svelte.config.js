import nodeAdapter from "@sveltejs/adapter-node";
import vercelAdapter from "@sveltejs/adapter-vercel";

const isVercel = Boolean(process.env.VERCEL);

/** @type {import("@sveltejs/kit").Config} */
const config = {
  kit: {
    adapter: isVercel ? vercelAdapter() : nodeAdapter(),
  },
};

export default config;
