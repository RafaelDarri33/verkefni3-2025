import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { serveStatic } from "@hono/node-server/serve-static"; // Import fyrir static skrár

// Búa til Prisma client
const prisma = new PrismaClient();

// Búa til Hono app
const app = new Hono();

// Þjónusta static skrár úr `public/`
app.use("/", serveStatic({ root: "./public" }));

// Root route
app.get("/", (c) => c.text("Vefþjónustan þín er keyrandi með Hono!"));

// API fyrir að sækja alla flokka úr gagnagrunni
app.get("/categories", async (c) => {
  try {
    const categories = await prisma.category.findMany();
    return c.json(categories);
  } catch (error) {
    console.error("Villa í /categories:", error);
    return c.json({ error: "Villa við að sækja flokka", details: String(error) }, 500);
  }
});

// API fyrir að sækja stakan flokk eftir `slug`
app.get("/categories/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return c.json({ error: "Flokkur fannst ekki" }, 404);
    }

    return c.json(category);
  } catch (error) {
    return c.json({ error: "Villa við að sækja flokk" }, 500);
  }
});

// API fyrir að búa til nýjan flokk
app.post("/category", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
  });

  const result = schema.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Ógild gögn" }, 400);
  }

  try {
    const newCategory = await prisma.category.create({
      data: result.data,
    });
    return c.json(newCategory, 201);
  } catch (error) {
    return c.json({ error: "Villa við að búa til flokk" }, 500);
  }
});

// API fyrir að sækja allar spurningar
app.get("/questions", async (c) => {
  try {
    const questions = await prisma.question.findMany({
      include: { category: true },
    });
    return c.json(questions);
  } catch (error) {
    return c.json({ error: "Villa við að sækja spurningar" }, 500);
  }
});

// API fyrir að sækja spurningar í ákveðnum flokki
app.get("/categories/:slug/questions", async (c) => {
  const slug = c.req.param("slug");

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { questions: true },
    });

    if (!category) {
      return c.json({ error: "Flokkur fannst ekki" }, 404);
    }

    return c.json(category.questions);
  } catch (error) {
    return c.json({ error: "Villa við að sækja spurningar fyrir flokk" }, 500);
  }
});

// API fyrir að búa til nýja spurningu
app.post("/question", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    text: z.string().min(1),
    categoryId: z.number(),
  });

  const result = schema.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Ógild gögn" }, 400);
  }

  try {
    const newQuestion = await prisma.question.create({
      data: result.data,
    });
    return c.json(newQuestion, 201);
  } catch (error) {
    return c.json({ error: "Villa við að búa til spurningu" }, 500);
  }
});

// API fyrir að uppfæra spurningu
app.patch("/question/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  try {
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: body,
    });
    return c.json(updatedQuestion);
  } catch (error) {
    return c.json({ error: "Villa við að uppfæra spurningu" }, 500);
  }
});

// API fyrir að eyða spurningu
app.delete("/question/:id", async (c) => {
  const id = Number(c.req.param("id"));

  try {
    await prisma.question.delete({ where: { id } });
    return c.body(null, 204);
  } catch (error) {
    return c.json({ error: "Villa við að eyða spurningu" }, 500);
  }
});

// Keyra serverinn
serve(app);
