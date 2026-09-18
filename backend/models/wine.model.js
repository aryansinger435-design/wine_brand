import mongoose from "mongoose";

const wineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Wine name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Red Wine",
        "White Wine",
        "Sparkling & Champagne",
        "Rosé",
        "Dessert & Fortified",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price in INR is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: "INR",
    },
    currencySymbol: {
      type: String,
      default: "₹",
    },
    mfgDate: {
      type: String,
      required: [true, "Manufacturing date is required"],
    },
    expDate: {
      type: String,
      required: [true, "Expiry date / Best before is required"],
    },
    vintage: {
      type: Number,
      required: true,
    },
    alcoholPercentage: {
      type: String,
      default: "13.5% ABV",
    },
    volume: {
      type: String,
      default: "750 ml",
    },
    region: {
      type: String,
      required: true,
    },
    grapeVariety: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tastingNotes: {
      aroma: { type: String, default: "" },
      palate: { type: String, default: "" },
      finish: { type: String, default: "" },
      foodPairing: { type: String, default: "" },
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 30,
    },
    badge: {
      type: String,
      default: "Cellar Reserve",
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wine = mongoose.model("Wine", wineSchema);
export default Wine;
