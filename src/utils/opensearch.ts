import { Client } from "@opensearch-project/opensearch";
const host: String = process.env.OPENSEARCH_HOST!;
const protocol: String = "https";
const port: Number = parseInt(process.env.OPENSEARCH_PORT!);
const auth: String = process.env.OPENSEARCH_AUTH!;

export const Opensearch = () => {
  return new Client({
    node: protocol + "://" + auth + "@" + host + ":" + port,
    ssl: {
      rejectUnauthorized: false,
    },
  });
};
