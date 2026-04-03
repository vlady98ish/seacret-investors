import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN кэширует API — после Publish в Studio изменения могут приходить с задержкой.
  // В dev отключаем, чтобы сразу видеть актуальный контент (и совпадало со Studio).
  useCdn: process.env.NODE_ENV === "production",
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
