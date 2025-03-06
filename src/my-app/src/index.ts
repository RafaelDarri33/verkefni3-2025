import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hono vefþjónustan þín er keyrandi!");
});

export default app;
