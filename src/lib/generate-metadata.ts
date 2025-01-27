import { type Metadata } from "next";

const generateMetadata = (metadata?: Metadata) => {
  const title = typeof metadata?.title === "string" ? metadata.title : "Title";

  return {
    title: `${title} | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    description:
      metadata?.description ??
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icons: metadata?.icons ?? [{ rel: "icon", url: "/favicon.ico" }],
  };
};

export default generateMetadata;
