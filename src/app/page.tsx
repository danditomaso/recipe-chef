import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scraper } from "@/lib/Scraper";
import { handleURLInput } from "./receipe/actions";

export default async function Home() {
  // const parser = new Scraper();
  // console.log(await parser.getRecipe(""));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={handleURLInput} className="flex">
        <Input placeholder="Enter a URL" name="url" />
        <Button type="submit" className="bg-">
          Scrape
        </Button>
      </form>
    </main>
  );
}
