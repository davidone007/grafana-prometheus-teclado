const express = require("express");
const path = require("path");
const client = require("prom-client");

const app = express();

// Collect default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// A simple counter to track page views
const pageViews = new client.Counter({
  name: "app_page_views_total",
  help: "Total page views served by the app",
});

// Serve static files from project root but disable automatic index handling
// so we can count visits to '/' explicitly.
app.use(express.static(path.join(__dirname), { index: false }));

// Count visits to the root page and to /index.html
app.get("/", (req, res) => {
  pageViews.inc();
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  pageViews.inc();
  res.sendFile(path.join(__dirname, "index.html"));
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
