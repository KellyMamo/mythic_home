
import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const HOUSES_FILE = path.join(DATA_DIR, "houses.json");
const FILTERS_FILE = path.join(DATA_DIR, "filters.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initial Data setup
const INITIAL_DATA = [
  {
    id: '1',
    slug: 'the-grand-farmhouse',
    name: 'The Grand Farmhouse',
    description: 'A stunning modern farmhouse featuring wrap-around porches and an open-concept living area perfect for hosting. The primary suite offers a spa-like retreat on the main level.',
    style: 'Modern Farmhouse',
    beds: 4,
    baths: 3.5,
    garageCars: 3,
    areaValue: 2850,
    areaUnit: 'sq ft',
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    ],
    floorplanUrls: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800'],
    downloadFiles: [{ label: 'Full PDF Specs', url: '#' }],
    published: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    floors: 2,
    propertyType: 'Single Family',
    dimensions: {
      width: "35' 0\"",
      depth: "49' 0\"",
      maxRidgeHeight: "19' 9\""
    },
    ceilingHeights: {
      firstFloor: "9'",
      rooms: [
        { room: "Living Room", type: "Vaulted", height: "11' 0\"" },
        { room: "Bedroom 1", type: "Tray", height: "10' 0\"" }
      ]
    },
    roofDetails: {
      primaryPitch: "7.5 on 12",
      secondaryPitch: "12 on 12",
      framingType: "Truss"
    },
    exteriorWalls: "2x6",
    specialFeatures: ["Bedroom - Split", "Breakfast Nook", "Laundry - Main Level", "Master Suite - 1st Floor", "Mudroom"],
    planCollections: ["Exclusive"],
    sqftBreakdown: [
      { label: "Total Heated Area", value: "1,290 sq. ft." },
      { label: "1st Floor", value: "1,290 sq. ft." },
      { label: "Porch, Front", value: "112 sq. ft." },
      { label: "Porch, Rear", value: "114 sq. ft." },
      { label: "Porch, Combined", value: "226 sq. ft." }
    ],
    foundationType: {
      standard: "Monolithic Slab, Slab",
      optional: "Crawl"
    }
  }
];

const INITIAL_FILTERS = {
  allowedStyles: ['Modern Farmhouse', 'Craftsman', 'Contemporary', 'European', 'Traditional', 'Modern', 'Ranch', 'Cottage'],
  allowedPropertyTypes: ['Single Family', 'Multi-Family', 'Garages', 'Accessory Structures'],
  allowedBeds: [1, 2, 3, 4, 5],
  allowedBaths: [1, 1.5, 2, 2.5, 3, 3.5, 4],
  allowedFloors: [1, 2, 3]
};

// Helper to read/write JSON
const readJson = (file, fallback) => {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // API Routes
  app.get("/api/houses", (req, res) => {
    try {
      const houses = readJson(HOUSES_FILE, INITIAL_DATA);
      res.json(houses);
    } catch (err) {
      console.error("Error reading houses:", err);
      res.status(500).json({ error: "Failed to read houses" });
    }
  });

  app.get("/api/filters", (req, res) => {
    const filters = readJson(FILTERS_FILE, INITIAL_FILTERS);
    res.json(filters);
  });

  app.post("/api/houses", (req, res) => {
    try {
      const house = req.body;
      const originalId = req.query.originalId as string;
      let houses = readJson(HOUSES_FILE, INITIAL_DATA);
      
      const lookupId = originalId || house.id;
      const index = houses.findIndex(h => h.id === lookupId);
      
      const updatedHouse = { ...house, updatedAt: Date.now() };
      
      if (index > -1) {
        houses[index] = updatedHouse;
        console.log(`Updated house: ${updatedHouse.id}`);
      } else {
        houses.push(updatedHouse);
        console.log(`Created house: ${updatedHouse.id}`);
      }
      
      writeJson(HOUSES_FILE, houses);
      res.json({ success: true, house: updatedHouse });
    } catch (err) {
      console.error("Error saving house:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.post("/api/filters", (req, res) => {
    const filters = req.body;
    writeJson(FILTERS_FILE, filters);
    res.json({ success: true });
  });

  app.delete("/api/houses/:id", (req, res) => {
    const { id } = req.params;
    let houses = readJson(HOUSES_FILE, INITIAL_DATA);
    houses = houses.filter(h => h.id !== id);
    writeJson(HOUSES_FILE, houses);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static serving for production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
