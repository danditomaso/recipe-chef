import React from "react";

function RecipeLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-8 bg-gray-700 h-screen w-full">{children}</div>;
}

export default RecipeLayout;
