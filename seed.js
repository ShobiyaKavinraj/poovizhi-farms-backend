const mongoose = require('mongoose');
const Product = require('./models/Product');


const products = [

  {
    _id: 1,
    name: 'Dry Avarampoo Tea',
    price: 95,
    quantity: '25g',
    imageUrl: '/img1.jpg',
    description: `Avarampoo (Senna auriculata) tea is known for its cooling and detoxifying properties. Traditionally used in Siddha medicine.

✨ Benefits:
- Helps regulate blood sugar
- Cools the body during summer
- Supports clear skin and digestion

☕ How to Use:
Steep 1 tsp in hot water for 5–7 minutes. Add honey or lemon if desired. Enjoy daily for best results.`
  },
  {
    _id: 2,
    name: 'Dry Hibiscus Tea',
    price: 78,
    quantity: '25g',
    imageUrl: '/img2.jpg',
    description: `Dried Hibiscus petals (Hibiscus sabdariffa) create a vibrant, tart herbal tea loaded with antioxidants and vitamin C.

✨ Benefits:
- Boosts immunity & skin health
- Helps manage blood pressure
- Aids digestion & fat metabolism

☕ How to Use:
Steep 1 tsp in hot water for 5–6 minutes. Enjoy hot or cold. Pairs well with cinnamon or ginger.`
  },
  {
    _id: 3,
    name: 'Coconut Oil',
    variants: [
      { quantity: '500ml', price: 190 },
      { quantity: '1lt', price: 380 },
    ],
    imageUrl: '/coconut.jpg',
    description: `Cold-pressed Coconut Oil from premium coconuts. Pure, unrefined, and naturally aromatic.

✨ Benefits:
- Deep hair and scalp nourishment
- Natural skin moisturizer
- Great for oil pulling & cooking

🧴 How to Use:
Apply to hair before shampooing or use daily as a body oil. Also suitable for sautéing and frying in cooking.`
  },
  {
    _id: 4,
    name: 'Moringa Leaves Powder',
    price: 95,
    quantity: '100g',
    imageUrl: '/moringa.jpg',
    description: `Made from sun-dried Moringa oleifera leaves — a complete superfood known as the “Miracle Tree.”

✨ Benefits:
- High in iron, calcium, vitamin A & C
- Supports immunity & energy
- Natural detoxifier

🥄 How to Use:
Mix 1 tsp into smoothies, juices, soups, or warm water. Best consumed in the morning or post meals.`
  },
  {
    _id: 5,
    name: 'Hibiscus Dried Flower',
    price: 130,
    quantity: '100g',
    imageUrl: '/img6.jpg',
    description: `Naturally dried hibiscus flowers for tea, skincare, and hair masks.

✨ Benefits:
- Rich in antioxidants
- Natural hair conditioner & scalp soother
- Anti-aging and rejuvenating for skin

💡 How to Use:
Use in teas, infuse in oil for hair, or grind into powder for DIY masks.`
  },
  {
    _id: 6,

    name: 'Jaggery Powder',
    variants: [
      { quantity: '500g', price: 65 },
      { quantity: '1Kg', price: 130 },
    ],
    imageUrl: '/jaggery.jpg',
    description: `Unrefined jaggery powder made from sugarcane juice — a natural sweetener with rich mineral content.

✨ Benefits:
- Boosts digestion & detoxes liver
- Helps fight fatigue & anemia
- Natural alternative to white sugar

🍬 How to Use:
Add to tea, desserts, or Indian dishes like Pongal and sambar. Use 1:1 as sugar substitute.`
  },
  {
    _id: 7,
    name: 'Pure Hibiscus Powder',
    price: 199,
    quantity: '100g',
    imageUrl: '/hibipowder.jpg',
    description: `Finely ground hibiscus flower powder for hair and skincare.

✨ Benefits:
- Promotes hair growth and prevents dandruff
- Tightens skin & reduces pigmentation
- Rich in vitamin C & AHAs

💆 How to Use:
Mix with water or yogurt for hair mask. For face, combine with rose water or aloe vera gel.`
  },
  {
    _id: 8,
    name: 'Pure Avarampoo Powder',
    price: 199,
    quantity: '100g',
    imageUrl: '/avapowder.jpg',
    description: `Avarampoo powder made from dried flowers of Senna auriculata. Known in Tamil medicine for its cleansing power.

✨ Benefits:
- Glowing skin and acne control
- Supports blood sugar regulation
- Detoxifying & cooling

🧖 How to Use:
Use as a face pack with turmeric or honey. Mix in water or buttermilk for internal use.`
  },

  
{
  _id: 9,
    name: 'Tumeric Powder',
    price: 120,
    quantity: '100g',
    imageUrl: '/tumericpowder.jpg',
    description: `Turmeric powder is a golden spice prized for its anti-inflammatory and antioxidant benefits.

✨ Benefits:
- Boosts immunity & fights inflammation
- Supports liver health
- Natural antiseptic & antibacterial

🧂 How to Use:
Use in curries, smoothies, or mix with warm milk (Golden Milk) for wellness.`
  },
  {
    _id: 10,
    name: 'Hibiscus Lemon Tea',
    price: 130,
    quantity: '100g',
    imageUrl: '/hibiscuslemontea.jpg',
    
    description: `A refreshing blend of tangy hibiscus and zesty lemon — perfect for hot summer days.

✨ Benefits:
- Hydrates and refreshes
- Rich in vitamin C
- Supports digestion and immunity

🍹 How to Use:
Steep 1 tsp in hot water for 5–6 mins. Chill for iced tea, add mint or honey for flavor.`
  },
  {
    _id: 11,
    name: 'Lemon Tea',
    price: 180,
    quantity: '250ml',
    imageUrl: '/lemontea.jpg',
    
    description: `Invigorating lemon tea packed with antioxidants and a natural zesty flavor.

✨ Benefits:
- Aids digestion
- Boosts hydration & detox
- Natural mood booster

☕ How to Use:
Ready-to-drink or reheat slightly. Best served warm or chilled.`
  },

  {
    _id: 12,
    name: 'Lemon Dishwash Powder',
    price: 180,
    quantity: '250ml',
    imageUrl: '/dishwash.jpg',
    
    description: `Natural dishwashing powder with lemon essence for sparkling clean utensils.

✨ Features:
- Cuts grease naturally
- Safe on hands, chemical-free
- Eco-friendly & biodegradable

🧽 How to Use:
Use 1 tbsp per sink load. Soak for tough stains. Store in a dry container.`
  },
  {
    _id: 13,
    name: 'Lemon Premix Powder',
    price: 200,
    quantity: '250g',
    imageUrl: '/lemonpremix.jpg',
  
    description: `Instant lemon drink premix made from natural lemon powder and cane sugar.

✨ Benefits:
- Instant refreshment
- Rehydrates and energizes
- Supports digestion

🥤 How to Use:
Mix 2 tsp with cold water. Add mint or ice for extra zing!`
  },
  {
    _id: 14,
    name: 'ABC Malt',
    price: 120,
    quantity: '100g',
    imageUrl: '/abcmalt.jpg',
    
    description: `A wholesome health drink made from almonds, bajra, and cashews.

✨ Benefits:
- Nutrient-rich & energizing
- Builds strength & stamina
- Great for kids & adults

🥣 How to Use:
Mix with warm milk or water. Sweeten if needed. Perfect for breakfast or evening drink.`
  },
  {
    _id: 15,
    name: 'Ragi Malt',
    price: 100,
    quantity: '100g',
    imageUrl: '/ragimalt.jpg',
    
    description: `Nutritious ragi-based malt loaded with calcium, iron, and fiber.

✨ Benefits:
- Supports bone health
- Aids digestion & energy
- Ideal for toddlers, elders, and fitness lovers

🥄 How to Use:
Boil with milk or water. Add jaggery or cardamom for flavor.`
  },
  {
    _id: 16,
    name: 'BeetRoot Malt',
    price: 100,
    quantity: '100g',
    imageUrl: '/beetmalt.jpg',
    
    description: `A vibrant pink malt packed with beetroot goodness and natural energy.

✨ Benefits:
- Boosts stamina & blood health
- Improves skin glow
- Rich in iron and antioxidants

🍶 How to Use:
Mix with warm milk or water. Add honey for sweetness. Great as a mid-day energizer.`
  }

];

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/poovizhifarms");
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("🌱 Seeded successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

seed();
