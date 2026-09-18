import Wine from "../models/wine.model.js";

// Luxury Wine Seed Data with authentic Indian Rupee pricing, Mfg/Exp dates, and tasting profiles
export const sampleWines = [
  {
    name: "Château Dhariwal Grand Reserve",
    tagline: "Single Vineyard Oak-Aged Cabernet Sauvignon",
    category: "Red Wine",
    price: 3899,
    originalPrice: 4499,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "15-Mar-2021",
    expDate: "15-Mar-2036 (Ideal cellaring: 15 Years)",
    vintage: 2020,
    alcoholPercentage: "14.2% ABV",
    volume: "750 ml",
    region: "Nashik Valley Reserve & Bordeaux Cask, India",
    grapeVariety: "85% Cabernet Sauvignon, 15% Merlot",
    description:
      "A flagship full-bodied masterpiece aged for 24 months in medium-toasted French Allier oak barrels. Boasts velvety tannins, dark blackberry opulence, and delicate notes of cigar box, vanilla pod, and roasted coffee bean.",
    tastingNotes: {
      aroma: "Blackcurrant compote, cedarwood, crushed violets, and sweet tobacco leaf.",
      palate: "Layered and majestic with ripe black cherries, dark dark chocolate, and silky structured tannins.",
      finish: "Enduring, warm finish with lingering hints of allspice and toasted oak.",
      foodPairing: "Prime dry-aged ribeye, rosemary lamb chops, wild truffle risotto, or mature gouda.",
    },
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    stockQuantity: 42,
    badge: "Grand Reserve",
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Imperial Cuvée Brut Champagne",
    tagline: "Méthode Traditionnelle Sparkling Elegance",
    category: "Sparkling & Champagne",
    price: 5499,
    originalPrice: 6200,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "20-Jan-2022",
    expDate: "20-Jan-2028 (Best chilled within 6 Years)",
    vintage: 2021,
    alcoholPercentage: "12.5% ABV",
    volume: "750 ml",
    region: "Épernay Vallée & Dindori Terroir",
    grapeVariety: "60% Chardonnay, 40% Pinot Noir",
    description:
      "Crafted according to the strict classical champagne method, resting on lees for 36 months. Displays ultra-fine persistent golden bubbles, crisp acidity, and toasted brioche brioche sophistication.",
    tastingNotes: {
      aroma: "Crisp green apple, Meyer lemon zest, white blossom flowers, and fresh brioche.",
      palate: "Vibrant effervescence, flinty minerality, roasted almond, and luscious creamy mouthfeel.",
      finish: "Brilliantly clean, chalky, citrus-infused aristocratic finish.",
      foodPairing: "Fresh oysters, lobster thermidor, caviar blinis, or light goat cheese tartlets.",
    },
    rating: 4.8,
    reviewsCount: 62,
    inStock: true,
    stockQuantity: 28,
    badge: "Bestseller",
    imageUrl:
      "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Aura Royale Rosé de Saignée",
    tagline: "Sun-drenched Provence Style Crisp Dry Rosé",
    category: "Rosé",
    price: 1999,
    originalPrice: 2450,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "10-Feb-2023",
    expDate: "10-Feb-2026 (Best fresh within 3 Years)",
    vintage: 2022,
    alcoholPercentage: "12.8% ABV",
    volume: "750 ml",
    region: "Hills of Igatpuri & Côtes de Provence, India",
    grapeVariety: "Grenache, Cinsault, Syrah",
    description:
      "A pale salmon-pink jewel radiating fresh Mediterranean vibrance. Cold-fermented in stainless steel to capture the purity of ripe wild strawberries, juicy white peach, and crushed sea-salt minerality.",
    tastingNotes: {
      aroma: "Wild red berries, delicate rose petals, citrus peel, and white peach blossom.",
      palate: "Zesty and bone-dry with refreshing acidity, ripe raspberry, and melon notes.",
      finish: "Lively, crisp, refreshing with a delicate floral persistence.",
      foodPairing: "Grilled tiger prawns, sushi platters, Mediterranean salad, or prosciutto with melon.",
    },
    rating: 4.7,
    reviewsCount: 39,
    inStock: true,
    stockQuantity: 65,
    badge: "Summer Selection",
    imageUrl:
      "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Vallée d'Or Chardonnay Réserve",
    tagline: "Buttery Barrel-Fermented White Gold",
    category: "White Wine",
    price: 2899,
    originalPrice: 3299,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "05-Aug-2022",
    expDate: "05-Aug-2029 (Aged gracefully 7 Years)",
    vintage: 2021,
    alcoholPercentage: "13.2% ABV",
    volume: "750 ml",
    region: "Nandi Hills Terroir & Burgundian Heritage",
    grapeVariety: "100% Noble Chardonnay",
    description:
      "Fermented and batonnage-aged in fine French oak for 10 months. Melds crisp golden delicious apple and poached pear with rich Madagascar vanilla, toasted hazelnut, and melted churned butter.",
    tastingNotes: {
      aroma: "Ripe pineapple, yellow peach, toasted almond flakes, and delicate smoky oak.",
      palate: "Opulent and viscous yet impeccably balanced with bright lemon curd acidity.",
      finish: "Long, velvety, and luxurious with toasted brioche and vanilla bean.",
      foodPairing: "Pan-seared Chilean sea bass, roasted butter chicken, fettuccine Alfredo, or brie.",
    },
    rating: 4.9,
    reviewsCount: 51,
    inStock: true,
    stockQuantity: 34,
    badge: "Sommelier Choice",
    imageUrl:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Heritage Shiraz Amarone Cask",
    tagline: "Bold Spiced Velvet Aged in Ancient Amarone Barrels",
    category: "Red Wine",
    price: 4499,
    originalPrice: 5199,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "18-Nov-2020",
    expDate: "18-Nov-2035 (Cellar Ageing: 15 Years)",
    vintage: 2019,
    alcoholPercentage: "14.5% ABV",
    volume: "750 ml",
    region: "Baramati Plateau & Valpolicella Casks, India",
    grapeVariety: "100% Estate Shiraz",
    description:
      "An intensely concentrated powerhouse crafted from low-yield hand-harvested vines. Finished for 18 months in rare Amarone barrels to impart deep spiced plum, black peppercorn, espresso crema, and dark mocha nuances.",
    tastingNotes: {
      aroma: "Crushed black pepper, ripe damson plums, licorice root, and cacao.",
      palate: "Mouth-coating intensity, plush rounded tannins, boysenberry jam, and roasted espresso.",
      finish: "Decadent, lingering, and muscular with sweet spice warmth.",
      foodPairing: "Slow-braised mutton shank, venison, rich rogan josh, or dark 85% chocolate.",
    },
    rating: 5.0,
    reviewsCount: 110,
    inStock: true,
    stockQuantity: 19,
    badge: "Limited Vintage",
    imageUrl:
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Nectar de Soleil Late Harvest",
    tagline: "Honeyed Golden Ambrosia Dessert Wine",
    category: "Dessert & Fortified",
    price: 2499,
    originalPrice: 2850,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "12-Dec-2022",
    expDate: "12-Dec-2037 (Endless longevity: 15+ Years)",
    vintage: 2022,
    alcoholPercentage: "11.5% ABV",
    volume: "500 ml",
    region: "Sahyadri Valley Golden Slopes",
    grapeVariety: "Chenin Blanc & Muscat of Alexandria",
    description:
      "Grapes left on the vine until winter frost deepens their natural nectar sweetness. Radiant deep amber color revealing rich acacia honey, candied orange peel, dried apricots, and delicate saffron strands.",
    tastingNotes: {
      aroma: "Dried apricots, orange blossom, wild honey, and toasted marzipan.",
      palate: "Luscious natural sweetness elevated by mouthwatering, crisp natural acidity.",
      finish: "Silky, sweet, and floral without being heavy.",
      foodPairing: "Foie gras, roquefort blue cheese, classic crème brûlée, or spiced apple crumble.",
    },
    rating: 4.8,
    reviewsCount: 29,
    inStock: true,
    stockQuantity: 22,
    badge: "Rare Elixir",
    imageUrl:
      "https://images.unsplash.com/photo-1547595628-c61a29f497f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Marquis Pinot Noir Cru",
    tagline: "Silky, Delicate Burgundy Style Ruby Elegance",
    category: "Red Wine",
    price: 3299,
    originalPrice: 3800,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "08-Oct-2021",
    expDate: "08-Oct-2031 (Peak Aging: 10 Years)",
    vintage: 2020,
    alcoholPercentage: "13.0% ABV",
    volume: "750 ml",
    region: "Cool Climate High-Altitude Slopes, Nilgiris & Nashik",
    grapeVariety: "100% Pinot Noir",
    description:
      "Ethereal and translucent ruby in the glass, exhibiting high-toned wild red currants, forest floor, damp earth, and subtle truffle essence. Hand-sorted and aged in neutral French oak puncheons.",
    tastingNotes: {
      aroma: "Sour cherry, wild cranberries, damp autumn leaves, and clove spice.",
      palate: "Medium-bodied elegance, gossamer tannins, piquant acidity, and refined red fruit purity.",
      finish: "Delicate and prolonged with lingering floral violet and spiced tea notes.",
      foodPairing: "Duck breast with cherry glaze, wild mushroom risotto, roasted quail, or salmon.",
    },
    rating: 4.7,
    reviewsCount: 44,
    inStock: true,
    stockQuantity: 37,
    badge: "Collector Pick",
    imageUrl:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sauvignon Blanc Fumé Reserve",
    tagline: "Crisp Mineral Flint with Subtle Smoked Oak",
    category: "White Wine",
    price: 1850,
    originalPrice: 2199,
    currency: "INR",
    currencySymbol: "₹",
    mfgDate: "22-Feb-2023",
    expDate: "22-Feb-2027 (Drink young within 4 Years)",
    vintage: 2022,
    alcoholPercentage: "12.5% ABV",
    volume: "750 ml",
    region: "Western Ghats Mountain Valleys",
    grapeVariety: "100% Sauvignon Blanc",
    description:
      "Partial barrel fermentation in lightly charred French casks gives this wine its unique 'Fumé' character. Bursting with passionfruit, lemongrass, flinty gunpowder minerality, and a whisper of smoked vanilla.",
    tastingNotes: {
      aroma: "Gooseberry, kaffir lime leaves, passionfruit, and crushed river stone.",
      palate: "Explosive citrus vibrancy, razor-sharp refreshing acidity, and subtle creamy smoke.",
      finish: "Clean, electric, lime-tinged mineral finish.",
      foodPairing: "Goat cheese crostini, grilled asparagus, lemon herb sea bass, or calamari.",
    },
    rating: 4.6,
    reviewsCount: 38,
    inStock: true,
    stockQuantity: 55,
    badge: "Crisp & Fresh",
    imageUrl:
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
  },
];

/**
 * Seed initial wines if collection is empty
 */
export async function seedInitialWines() {
  try {
    const count = await Wine.countDocuments();
    if (count === 0) {
      await Wine.insertMany(sampleWines);
      console.log(`[SEED] Initialized ${sampleWines.length} luxury vintage wines into MongoDB database.`);
    }
  } catch (err) {
    console.error("[SEED ERROR] Failed to seed initial wines:", err.message);
  }
}

/**
 * Manual seed / reset endpoint
 */
export async function seedWinesEndpoint(req, res, next) {
  try {
    await Wine.deleteMany({});
    const inserted = await Wine.insertMany(sampleWines);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} luxury wines into database.`,
      wines: inserted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all wines with search, filter, and sort
 */
export async function getWines(req, res, next) {
  try {
    const { category, search, sortBy, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { tagline: searchRegex },
        { region: searchRegex },
        { grapeVariety: searchRegex },
        { description: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "price_asc") sortOption = { price: 1 };
    else if (sortBy === "price_desc") sortOption = { price: -1 };
    else if (sortBy === "rating") sortOption = { rating: -1 };
    else if (sortBy === "vintage") sortOption = { vintage: -1 };

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (parsedPage - 1) * parsedLimit;

    const [wines, totalCount] = await Promise.all([
      Wine.find(query).sort(sortOption).skip(skip).limit(parsedLimit),
      Wine.countDocuments(query),
    ]);

    // Categories list with counts for quick UI filter
    const categories = [
      "All",
      "Red Wine",
      "White Wine",
      "Sparkling & Champagne",
      "Rosé",
      "Dessert & Fortified",
    ];

    return res.status(200).json({
      success: true,
      wines,
      totalCount,
      totalPages: Math.ceil(totalCount / parsedLimit),
      currentPage: parsedPage,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single wine by ID
 */
export async function getWineById(req, res, next) {
  try {
    const { id } = req.params;
    const wine = await Wine.findById(id);

    if (!wine) {
      return res.status(404).json({
        success: false,
        message: "Wine not found in cellar collection.",
      });
    }

    return res.status(200).json({
      success: true,
      wine,
    });
  } catch (error) {
    next(error);
  }
}
