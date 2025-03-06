import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Búa til Prisma client
const prisma = new PrismaClient();

// Búa til Hono app
const app = new Hono();

// Root route
app.get("/", (c) => c.text("Vefþjónustan þín er keyrandi með Hono!"));

// API fyrir að sækja alla flokka úr gagnagrunni
app.get("/categories", async (c) => {
  try {
    const categories = await prisma.category.findMany();
    return c.json(categories);
  } catch (error) {
    return c.json({ error: "Villa við að sækja flokka" }, 500);
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

// Keyra serverinn
serve(app);
