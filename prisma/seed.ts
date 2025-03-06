import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Lesa index.json til að finna allar spurningaskrár
const indexFile = "prisma/index.json";
const indexData = JSON.parse(fs.readFileSync(indexFile, "utf-8"));

async function main() {
  for (const entry of indexData) {
    if (!entry.title || !entry.file) continue; // Sleppa ógildum færslum

    const filePath = path.join("prisma/data", entry.file);
    if (!fs.existsSync(filePath)) continue; // Sleppa ef skrá finnst ekki

    const quizData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Finna eða búa til flokkinn (t.d. "HTML")
    let category = await prisma.category.findUnique({
      where: { slug: quizData.title.toLowerCase().replace(/\s+/g, "-") },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: quizData.title,
          slug: quizData.title.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }

    // Bæta við spurningum og svörum
    for (const q of quizData.questions) {
      const question = await prisma.question.create({
        data: {
          text: q.question,
          categoryId: category.id,
        },
      });

      for (const a of q.answers) {
        await prisma.answer.create({
          data: {
            text: a.answer,
            correct: a.correct,
            questionId: question.id,
          },
        });
      }
    }
  }

  console.log("Gögn sett í gagnagrunn!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
