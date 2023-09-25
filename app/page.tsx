import RecipeSearchInput from "./RecipeSearchInput";

export default async function Home() {
  return (
    <>
      <div className="w-full">
        {/* <h2 className="text-6xl font-bold text-center">Use the power of AI to clean a receipe </h2> */}
        <RecipeSearchInput />
      </div>
    </>
  );
}
