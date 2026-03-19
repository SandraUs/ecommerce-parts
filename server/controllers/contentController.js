const fs = require("fs");
const path = require("path");

let cache = null;

const load = () => {
  if (cache) return cache;
  const dbPath = path.resolve(__dirname, "..", "..", "client", "db.json");
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
  return cache;
};

class ContentController {
  async news(req, res) {
    const data = load();
    return res.json(data.news ?? []);
  }

  async stores(req, res) {
    const data = load();
    return res.json(data.stores ?? []);
  }

  async contacts(req, res) {
    const data = load();
    return res.json(data.contacts ?? []);
  }

  async vacancies(req, res) {
    const data = load();
    return res.json(data.vacancies ?? []);
  }
}

module.exports = new ContentController();
