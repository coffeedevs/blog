import { promises as fs } from "fs";
import path from "path";
import * as cheerio from "cheerio";

interface PageContentProps {
  slug: string[];
}

export default async function PageContent({ slug }: PageContentProps) {
  const filePath = path.join(process.cwd(), "..", "static-blog", slug.join("/"), "index.html");

  try {
    const html = await fs.readFile(filePath, "utf-8");
    const $ = cheerio.load(html);
    const bodyContent = $("body").html();
    return <div dangerouslySetInnerHTML={{ __html: bodyContent || "" }} />;
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Handle error, e.g., return a specific error message or null
    return <div>Error loading page content.</div>;
  }
}
