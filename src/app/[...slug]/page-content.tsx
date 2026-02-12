import { promises as fs } from "fs";
import path from "path";
import * as cheerio from "cheerio";

interface PageContentProps {
  slug: string[];
}

export default async function PageContent({ slug }: PageContentProps) {
  const filePath = path.join(process.cwd(), "..", "static-blog", slug.join("/"), "index.html");
  let bodyContent = "";
  let hasError = false;

  try {
    const html = await fs.readFile(filePath, "utf-8");
    const $ = cheerio.load(html);
    bodyContent = $("body").html() || "";
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <div>Error loading page content.</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}
