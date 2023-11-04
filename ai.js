import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content:
          "Can you take this URL, parse out the method, ingredients, and prep time according the JSON+LD Recipe schema and the response should include JSON? https://www.allrecipes.com/recipe/222164/easy-taco-seasoning-mix/",
      },
    ],
    model: "gpt-4",
  });

  console.log(completion.choices[0]);
}

main();
