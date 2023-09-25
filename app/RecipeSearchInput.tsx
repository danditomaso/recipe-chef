// import { postRecipeURL } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitRecipeRequest } from "@/actions";

export default function RecipeSearchInput() {
  return (
    <form className="flex items-center gap-2 justify-center w-full" action={submitRecipeRequest}>
      <Input placeholder="Paste a receipe URL to remove the clutter" type="text" name="url" />
      <Button type="submit">Search</Button>
    </form>
  );
}
