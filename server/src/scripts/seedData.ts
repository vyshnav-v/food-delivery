import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";
import Order from "../models/Order";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared\n");

    // Create Users
    console.log("👤 Creating users...");
    await User.create({
      name: "Admin User",
      email: "admin@fooddelivery.com",
      password: "admin123",
      mobile: "1234567890",
      role: "admin",
    });

    const customer1 = await User.create({
      name: "John Customer",
      email: "john@example.com",
      password: "password123",
      mobile: "9876543210",
      role: "customer",
    });

    const customer2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      mobile: "8765432109",
      role: "customer",
    });

    const customer3 = await User.create({
      name: "Mike Wilson",
      email: "mike@example.com",
      password: "password123",
      mobile: "7654321098",
      role: "customer",
    });

    const customer4 = await User.create({
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "password123",
      mobile: "6543210987",
      role: "customer",
    });

    const customer5 = await User.create({
      name: "David Brown",
      email: "david@example.com",
      password: "password123",
      mobile: "5432109876",
      role: "customer",
    });

    const customer6 = await User.create({
      name: "Emily Davis",
      email: "emily@example.com",
      password: "password123",
      mobile: "4321098765",
      role: "customer",
    });

    const customer7 = await User.create({
      name: "Robert Miller",
      email: "robert@example.com",
      password: "password123",
      mobile: "3210987654",
      role: "customer",
    });

    const customer8 = await User.create({
      name: "Lisa Anderson",
      email: "lisa@example.com",
      password: "password123",
      mobile: "2109876543",
      role: "customer",
    });

    const customer9 = await User.create({
      name: "James Taylor",
      email: "james@example.com",
      password: "password123",
      mobile: "1098765432",
      role: "customer",
    });

    const customer10 = await User.create({
      name: "Maria Garcia",
      email: "maria@example.com",
      password: "password123",
      mobile: "9988776655",
      role: "customer",
    });

    console.log(`✅ Created 11 users (1 admin, 10 customers)\n`);

    // Create Food Categories
    console.log("🍕 Creating food categories...");
    const categories = await Category.create([
      {
        name: "Pizza",
        description: "Delicious pizzas with various toppings and crusts",
      },
      {
        name: "Burgers",
        description: "Juicy burgers with premium ingredients",
      },
      {
        name: "Pasta",
        description: "Italian pasta dishes with authentic flavors",
      },
      {
        name: "Salads",
        description: "Fresh and healthy salad options",
      },
      {
        name: "Beverages",
        description: "Refreshing drinks and beverages",
      },
      {
        name: "Desserts",
        description: "Sweet treats and desserts",
      },
      {
        name: "Appetizers",
        description: "Starters and side dishes",
      },
      {
        name: "Asian Cuisine",
        description: "Authentic Asian dishes",
      },
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Create Products
    console.log("🍔 Creating food products...");
    const products = await Product.create([
      // Pizzas
      {
        name: "Margherita Pizza",
        description:
          "Classic pizza with tomato sauce, fresh mozzarella, basil, and olive oil",
        price: 12.99,
        category: categories[0]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/margherita-pizza.jpg",
        featured: true,
      },
      {
        name: "Pepperoni Pizza",
        description:
          "Loaded with pepperoni slices, mozzarella cheese, and tomato sauce",
        price: 14.99,
        category: categories[0]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/pepperoni-pizza.jpg",
        featured: true,
      },
      {
        name: "Vegetarian Supreme Pizza",
        description:
          "Bell peppers, mushrooms, onions, olives, and fresh vegetables",
        price: 13.99,
        category: categories[0]._id,
        stock: 80,
        status: "available",
        imageUrl: "/uploads/veggie-pizza.jpg",
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Grilled chicken, BBQ sauce, onions, and cilantro",
        price: 15.99,
        category: categories[0]._id,
        stock: 75,
        status: "available",
        imageUrl: "/uploads/bbq-chicken-pizza.jpg",
      },
      {
        name: "Hawaiian Pizza",
        description: "Ham, pineapple, mozzarella, and tomato sauce",
        price: 13.99,
        category: categories[0]._id,
        stock: 60,
        status: "available",
        imageUrl: "/uploads/hawaiian-pizza.jpg",
      },

      // Burgers
      {
        name: "Classic Cheeseburger",
        description:
          "Beef patty, cheddar cheese, lettuce, tomato, onions, and pickles",
        price: 9.99,
        category: categories[1]._id,
        stock: 120,
        status: "available",
        imageUrl: "/uploads/cheeseburger.jpg",
        featured: true,
      },
      {
        name: "Bacon Deluxe Burger",
        description: "Double beef patty, bacon, cheese, and special sauce",
        price: 12.99,
        category: categories[1]._id,
        stock: 90,
        status: "available",
        imageUrl: "/uploads/bacon-burger.jpg",
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty with avocado, lettuce, and tomato",
        price: 10.99,
        category: categories[1]._id,
        stock: 70,
        status: "available",
        imageUrl: "/uploads/veggie-burger.jpg",
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken breast, mayo, lettuce, and tomato",
        price: 10.49,
        category: categories[1]._id,
        stock: 85,
        status: "available",
        imageUrl: "/uploads/chicken-burger.jpg",
      },

      // Pasta
      {
        name: "Spaghetti Carbonara",
        description:
          "Creamy pasta with bacon, eggs, parmesan, and black pepper",
        price: 14.99,
        category: categories[2]._id,
        stock: 60,
        status: "available",
        imageUrl: "/uploads/carbonara.jpg",
        featured: true,
      },
      {
        name: "Fettuccine Alfredo",
        description: "Rich and creamy Alfredo sauce with fettuccine pasta",
        price: 13.99,
        category: categories[2]._id,
        stock: 65,
        status: "available",
        imageUrl: "/uploads/alfredo.jpg",
      },
      {
        name: "Penne Arrabbiata",
        description: "Spicy tomato sauce with garlic and red chili peppers",
        price: 12.99,
        category: categories[2]._id,
        stock: 70,
        status: "available",
        imageUrl: "/uploads/arrabbiata.jpg",
      },
      {
        name: "Lasagna",
        description: "Layered pasta with meat sauce, ricotta, and mozzarella",
        price: 15.99,
        category: categories[2]._id,
        stock: 45,
        status: "available",
        imageUrl: "/uploads/lasagna.jpg",
      },

      // Salads
      {
        name: "Caesar Salad",
        description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
        price: 8.99,
        category: categories[3]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/caesar-salad.jpg",
      },
      {
        name: "Greek Salad",
        description: "Cucumber, tomatoes, olives, feta cheese, and olive oil",
        price: 9.99,
        category: categories[3]._id,
        stock: 90,
        status: "available",
        imageUrl: "/uploads/greek-salad.jpg",
      },
      {
        name: "Chicken Avocado Salad",
        description: "Grilled chicken, avocado, mixed greens, and vinaigrette",
        price: 11.99,
        category: categories[3]._id,
        stock: 75,
        status: "available",
        imageUrl: "/uploads/chicken-salad.jpg",
      },

      // Beverages
      {
        name: "Coca-Cola",
        description: "Classic Coca-Cola soft drink (330ml)",
        price: 2.99,
        category: categories[4]._id,
        stock: 200,
        status: "available",
        imageUrl: "/uploads/coca-cola.jpg",
      },
      {
        name: "Orange Juice",
        description: "Freshly squeezed orange juice (250ml)",
        price: 3.99,
        category: categories[4]._id,
        stock: 150,
        status: "available",
        imageUrl: "/uploads/orange-juice.jpg",
      },
      {
        name: "Iced Tea",
        description: "Refreshing iced tea with lemon (500ml)",
        price: 3.49,
        category: categories[4]._id,
        stock: 180,
        status: "available",
        imageUrl: "/uploads/iced-tea.jpg",
      },
      {
        name: "Mineral Water",
        description: "Natural mineral water (500ml)",
        price: 1.99,
        category: categories[4]._id,
        stock: 250,
        status: "available",
        imageUrl: "/uploads/water.jpg",
      },

      // Desserts
      {
        name: "Chocolate Brownie",
        description: "Rich chocolate brownie with vanilla ice cream",
        price: 6.99,
        category: categories[5]._id,
        stock: 80,
        status: "available",
        imageUrl: "/uploads/brownie.jpg",
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        price: 7.99,
        category: categories[5]._id,
        stock: 60,
        status: "available",
        imageUrl: "/uploads/tiramisu.jpg",
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake with berry compote",
        price: 7.49,
        category: categories[5]._id,
        stock: 70,
        status: "available",
        imageUrl: "/uploads/cheesecake.jpg",
      },
      {
        name: "Ice Cream Sundae",
        description:
          "Three scoops of ice cream with toppings and chocolate sauce",
        price: 5.99,
        category: categories[5]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/sundae.jpg",
      },

      // Appetizers
      {
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter and herbs",
        price: 4.99,
        category: categories[6]._id,
        stock: 150,
        status: "available",
        imageUrl: "/uploads/garlic-bread.jpg",
      },
      {
        name: "Chicken Wings",
        description: "Crispy chicken wings with choice of sauce (6 pieces)",
        price: 8.99,
        category: categories[6]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/wings.jpg",
      },
      {
        name: "Mozzarella Sticks",
        description: "Fried mozzarella sticks with marinara sauce (6 pieces)",
        price: 6.99,
        category: categories[6]._id,
        stock: 120,
        status: "available",
        imageUrl: "/uploads/mozzarella-sticks.jpg",
      },
      {
        name: "French Fries",
        description: "Crispy golden french fries with ketchup",
        price: 3.99,
        category: categories[6]._id,
        stock: 200,
        status: "available",
        imageUrl: "/uploads/fries.jpg",
      },

      // Asian Cuisine
      {
        name: "Pad Thai",
        description: "Thai stir-fried rice noodles with shrimp and peanuts",
        price: 13.99,
        category: categories[7]._id,
        stock: 70,
        status: "available",
        imageUrl: "/uploads/pad-thai.jpg",
      },
      {
        name: "Chicken Fried Rice",
        description: "Fried rice with chicken, vegetables, and soy sauce",
        price: 11.99,
        category: categories[7]._id,
        stock: 85,
        status: "available",
        imageUrl: "/uploads/fried-rice.jpg",
      },
      {
        name: "Vegetable Spring Rolls",
        description: "Crispy spring rolls filled with vegetables (4 pieces)",
        price: 6.99,
        category: categories[7]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/spring-rolls.jpg",
      },
      {
        name: "Beef Teriyaki",
        description: "Grilled beef with teriyaki sauce and steamed rice",
        price: 15.99,
        category: categories[7]._id,
        stock: 60,
        status: "available",
        imageUrl: "/uploads/teriyaki.jpg",
      },

      // More Pizzas
      {
        name: "Meat Lovers Pizza",
        description: "Pepperoni, sausage, bacon, and ham on a cheese pizza",
        price: 17.99,
        category: categories[0]._id,
        stock: 55,
        status: "available",
        imageUrl: "/uploads/meat-pizza.jpg",
      },
      {
        name: "Four Cheese Pizza",
        description: "Mozzarella, parmesan, gorgonzola, and ricotta cheese",
        price: 14.99,
        category: categories[0]._id,
        stock: 65,
        status: "available",
        imageUrl: "/uploads/four-cheese-pizza.jpg",
      },

      // More Burgers
      {
        name: "Mushroom Swiss Burger",
        description: "Beef patty with sautéed mushrooms and Swiss cheese",
        price: 11.99,
        category: categories[1]._id,
        stock: 80,
        status: "available",
        imageUrl: "/uploads/mushroom-burger.jpg",
      },
      {
        name: "BBQ Burger",
        description: "Beef patty with BBQ sauce, onion rings, and cheddar",
        price: 12.49,
        category: categories[1]._id,
        stock: 75,
        status: "available",
        imageUrl: "/uploads/bbq-burger.jpg",
      },

      // More Pasta
      {
        name: "Seafood Linguine",
        description:
          "Linguine with shrimp, mussels, and clams in white wine sauce",
        price: 18.99,
        category: categories[2]._id,
        stock: 40,
        status: "available",
        imageUrl: "/uploads/seafood-linguine.jpg",
      },
      {
        name: "Pesto Pasta",
        description: "Penne pasta with fresh basil pesto and pine nuts",
        price: 13.49,
        category: categories[2]._id,
        stock: 60,
        status: "available",
        imageUrl: "/uploads/pesto-pasta.jpg",
      },

      // More Salads
      {
        name: "Caprese Salad",
        description:
          "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
        price: 10.99,
        category: categories[3]._id,
        stock: 80,
        status: "available",
        imageUrl: "/uploads/caprese-salad.jpg",
      },

      // More Desserts
      {
        name: "Apple Pie",
        description: "Classic apple pie with vanilla ice cream",
        price: 6.49,
        category: categories[5]._id,
        stock: 75,
        status: "available",
        imageUrl: "/uploads/apple-pie.jpg",
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center",
        price: 8.99,
        category: categories[5]._id,
        stock: 50,
        status: "available",
        imageUrl: "/uploads/lava-cake.jpg",
      },

      // More Asian Cuisine
      {
        name: "Sushi Platter",
        description: "Assorted sushi rolls and nigiri (12 pieces)",
        price: 19.99,
        category: categories[7]._id,
        stock: 45,
        status: "available",
        imageUrl: "/uploads/sushi.jpg",
      },
      {
        name: "Ramen Bowl",
        description: "Traditional Japanese ramen with pork and soft-boiled egg",
        price: 14.99,
        category: categories[7]._id,
        stock: 55,
        status: "available",
        imageUrl: "/uploads/ramen.jpg",
      },
      {
        name: "Orange Chicken",
        description: "Crispy chicken in sweet orange sauce with rice",
        price: 12.99,
        category: categories[7]._id,
        stock: 70,
        status: "available",
        imageUrl: "/uploads/orange-chicken.jpg",
      },

      // More Appetizers
      {
        name: "Onion Rings",
        description: "Crispy fried onion rings with ranch dip",
        price: 5.99,
        category: categories[6]._id,
        stock: 150,
        status: "available",
        imageUrl: "/uploads/onion-rings.jpg",
      },
      {
        name: "Nachos",
        description: "Tortilla chips with cheese, jalapenos, and salsa",
        price: 7.99,
        category: categories[6]._id,
        stock: 100,
        status: "available",
        imageUrl: "/uploads/nachos.jpg",
      },
      {
        name: "Calamari",
        description: "Fried calamari rings with marinara sauce",
        price: 9.99,
        category: categories[6]._id,
        stock: 65,
        status: "available",
        imageUrl: "/uploads/calamari.jpg",
      },

      // More Beverages
      {
        name: "Lemonade",
        description: "Fresh squeezed lemonade (500ml)",
        price: 3.49,
        category: categories[4]._id,
        stock: 180,
        status: "available",
        imageUrl: "/uploads/lemonade.jpg",
      },
      {
        name: "Smoothie",
        description: "Mixed fruit smoothie (400ml)",
        price: 4.99,
        category: categories[4]._id,
        stock: 120,
        status: "available",
        imageUrl: "/uploads/smoothie.jpg",
      },
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // Create Sample Orders
    console.log("📦 Creating sample orders...");
    const orders = await Order.create([
      {
        user: customer1._id,
        items: [
          {
            product: products[0]._id, // Margherita Pizza
            quantity: 2,
            price: products[0].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 2,
            price: products[16].price,
          },
        ],
        totalAmount: products[0].price * 2 + products[16].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        user: customer2._id,
        items: [
          {
            product: products[5]._id, // Classic Cheeseburger
            quantity: 3,
            price: products[5].price,
          },
          {
            product: products[26]._id, // French Fries
            quantity: 3,
            price: products[26].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 3,
            price: products[16].price,
          },
        ],
        totalAmount:
          products[5].price * 3 +
          products[26].price * 3 +
          products[16].price * 3,
        status: "delivered",
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        user: customer3._id,
        items: [
          {
            product: products[9]._id, // Spaghetti Carbonara
            quantity: 1,
            price: products[9].price,
          },
          {
            product: products[13]._id, // Caesar Salad
            quantity: 1,
            price: products[13].price,
          },
          {
            product: products[17]._id, // Orange Juice
            quantity: 1,
            price: products[17].price,
          },
        ],
        totalAmount:
          products[9].price + products[13].price + products[17].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        user: customer1._id,
        items: [
          {
            product: products[1]._id, // Pepperoni Pizza
            quantity: 1,
            price: products[1].price,
          },
          {
            product: products[24]._id, // Garlic Bread
            quantity: 1,
            price: products[24].price,
          },
          {
            product: products[20]._id, // Chocolate Brownie
            quantity: 2,
            price: products[20].price,
          },
        ],
        totalAmount:
          products[1].price + products[24].price + products[20].price * 2,
        status: "confirmed",
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user: customer2._id,
        items: [
          {
            product: products[27]._id, // Pad Thai
            quantity: 2,
            price: products[27].price,
          },
          {
            product: products[29]._id, // Spring Rolls
            quantity: 1,
            price: products[29].price,
          },
          {
            product: products[18]._id, // Iced Tea
            quantity: 2,
            price: products[18].price,
          },
        ],
        totalAmount:
          products[27].price * 2 + products[29].price + products[18].price * 2,
        status: "pending",
        orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        user: customer3._id,
        items: [
          {
            product: products[3]._id, // BBQ Chicken Pizza
            quantity: 1,
            price: products[3].price,
          },
          {
            product: products[25]._id, // Chicken Wings
            quantity: 1,
            price: products[25].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 2,
            price: products[16].price,
          },
        ],
        totalAmount:
          products[3].price + products[25].price + products[16].price * 2,
        status: "pending",
        orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        user: customer1._id,
        items: [
          {
            product: products[10]._id, // Fettuccine Alfredo
            quantity: 2,
            price: products[10].price,
          },
          {
            product: products[14]._id, // Greek Salad
            quantity: 1,
            price: products[14].price,
          },
          {
            product: products[22]._id, // Cheesecake
            quantity: 1,
            price: products[22].price,
          },
        ],
        totalAmount:
          products[10].price * 2 + products[14].price + products[22].price,
        status: "delivered",
        orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        user: customer2._id,
        items: [
          {
            product: products[6]._id, // Bacon Deluxe Burger
            quantity: 1,
            price: products[6].price,
          },
          {
            product: products[26]._id, // French Fries
            quantity: 1,
            price: products[26].price,
          },
          {
            product: products[23]._id, // Ice Cream Sundae
            quantity: 1,
            price: products[23].price,
          },
        ],
        totalAmount:
          products[6].price + products[26].price + products[23].price,
        status: "delivered",
        orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      // Additional orders with new customers
      {
        user: customer4._id,
        items: [
          {
            product: products[31]._id, // Meat Lovers Pizza
            quantity: 2,
            price: products[31].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 3,
            price: products[16].price,
          },
        ],
        totalAmount: products[31].price * 2 + products[16].price * 3,
        status: "delivered",
        orderDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer5._id,
        items: [
          {
            product: products[35]._id, // Seafood Linguine
            quantity: 1,
            price: products[35].price,
          },
          {
            product: products[17]._id, // Orange Juice
            quantity: 1,
            price: products[17].price,
          },
        ],
        totalAmount: products[35].price + products[17].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        user: customer6._id,
        items: [
          {
            product: products[40]._id, // Sushi Platter
            quantity: 1,
            price: products[40].price,
          },
          {
            product: products[18]._id, // Iced Tea
            quantity: 2,
            price: products[18].price,
          },
        ],
        totalAmount: products[40].price + products[18].price * 2,
        status: "pending",
        orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        user: customer7._id,
        items: [
          {
            product: products[33]._id, // Mushroom Swiss Burger
            quantity: 2,
            price: products[33].price,
          },
          {
            product: products[44]._id, // Onion Rings
            quantity: 2,
            price: products[44].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 2,
            price: products[16].price,
          },
        ],
        totalAmount:
          products[33].price * 2 +
          products[44].price * 2 +
          products[16].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer8._id,
        items: [
          {
            product: products[41]._id, // Ramen Bowl
            quantity: 1,
            price: products[41].price,
          },
          {
            product: products[29]._id, // Spring Rolls
            quantity: 1,
            price: products[29].price,
          },
        ],
        totalAmount: products[41].price + products[29].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        user: customer9._id,
        items: [
          {
            product: products[32]._id, // Four Cheese Pizza
            quantity: 1,
            price: products[32].price,
          },
          {
            product: products[24]._id, // Garlic Bread
            quantity: 2,
            price: products[24].price,
          },
          {
            product: products[38]._id, // Apple Pie
            quantity: 1,
            price: products[38].price,
          },
        ],
        totalAmount:
          products[32].price + products[24].price * 2 + products[38].price,
        status: "pending",
        orderDate: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        user: customer10._id,
        items: [
          {
            product: products[42]._id, // Orange Chicken
            quantity: 2,
            price: products[42].price,
          },
          {
            product: products[28]._id, // Chicken Fried Rice
            quantity: 1,
            price: products[28].price,
          },
          {
            product: products[47]._id, // Smoothie
            quantity: 2,
            price: products[47].price,
          },
        ],
        totalAmount:
          products[42].price * 2 + products[28].price + products[47].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer1._id,
        items: [
          {
            product: products[4]._id, // Hawaiian Pizza
            quantity: 1,
            price: products[4].price,
          },
          {
            product: products[25]._id, // Chicken Wings
            quantity: 1,
            price: products[25].price,
          },
        ],
        totalAmount: products[4].price + products[25].price,
        status: "cancelled",
        orderDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer3._id,
        items: [
          {
            product: products[36]._id, // Pesto Pasta
            quantity: 2,
            price: products[36].price,
          },
          {
            product: products[37]._id, // Caprese Salad
            quantity: 1,
            price: products[37].price,
          },
          {
            product: products[46]._id, // Lemonade
            quantity: 2,
            price: products[46].price,
          },
        ],
        totalAmount:
          products[36].price * 2 + products[37].price + products[46].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer5._id,
        items: [
          {
            product: products[34]._id, // BBQ Burger
            quantity: 1,
            price: products[34].price,
          },
          {
            product: products[26]._id, // French Fries
            quantity: 1,
            price: products[26].price,
          },
          {
            product: products[39]._id, // Chocolate Lava Cake
            quantity: 1,
            price: products[39].price,
          },
        ],
        totalAmount:
          products[34].price + products[26].price + products[39].price,
        status: "delivered",
        orderDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer4._id,
        items: [
          {
            product: products[11]._id, // Penne Arrabbiata
            quantity: 1,
            price: products[11].price,
          },
          {
            product: products[14]._id, // Greek Salad
            quantity: 1,
            price: products[14].price,
          },
        ],
        totalAmount: products[11].price + products[14].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
      {
        user: customer6._id,
        items: [
          {
            product: products[45]._id, // Nachos
            quantity: 2,
            price: products[45].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 3,
            price: products[16].price,
          },
        ],
        totalAmount: products[45].price * 2 + products[16].price * 3,
        status: "pending",
        orderDate: new Date(Date.now() - 90 * 60 * 1000),
      },
      {
        user: customer8._id,
        items: [
          {
            product: products[2]._id, // Vegetarian Supreme Pizza
            quantity: 1,
            price: products[2].price,
          },
          {
            product: products[13]._id, // Caesar Salad
            quantity: 1,
            price: products[13].price,
          },
          {
            product: products[19]._id, // Mineral Water
            quantity: 2,
            price: products[19].price,
          },
        ],
        totalAmount:
          products[2].price + products[13].price + products[19].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer7._id,
        items: [
          {
            product: products[12]._id, // Lasagna
            quantity: 2,
            price: products[12].price,
          },
          {
            product: products[24]._id, // Garlic Bread
            quantity: 2,
            price: products[24].price,
          },
        ],
        totalAmount: products[12].price * 2 + products[24].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer9._id,
        items: [
          {
            product: products[7]._id, // Veggie Burger
            quantity: 2,
            price: products[7].price,
          },
          {
            product: products[26]._id, // French Fries
            quantity: 2,
            price: products[26].price,
          },
          {
            product: products[47]._id, // Smoothie
            quantity: 2,
            price: products[47].price,
          },
        ],
        totalAmount:
          products[7].price * 2 +
          products[26].price * 2 +
          products[47].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer10._id,
        items: [
          {
            product: products[46]._id, // Calamari
            quantity: 1,
            price: products[46].price,
          },
          {
            product: products[35]._id, // Seafood Linguine
            quantity: 1,
            price: products[35].price,
          },
          {
            product: products[22]._id, // Cheesecake
            quantity: 1,
            price: products[22].price,
          },
        ],
        totalAmount:
          products[46].price + products[35].price + products[22].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        user: customer2._id,
        items: [
          {
            product: products[27]._id, // Pad Thai
            quantity: 1,
            price: products[27].price,
          },
          {
            product: products[18]._id, // Iced Tea
            quantity: 1,
            price: products[18].price,
          },
        ],
        totalAmount: products[27].price + products[18].price,
        status: "pending",
        orderDate: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        user: customer1._id,
        items: [
          {
            product: products[1]._id, // Pepperoni Pizza
            quantity: 3,
            price: products[1].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 4,
            price: products[16].price,
          },
          {
            product: products[39]._id, // Chocolate Lava Cake
            quantity: 2,
            price: products[39].price,
          },
        ],
        totalAmount:
          products[1].price * 3 +
          products[16].price * 4 +
          products[39].price * 2,
        status: "delivered",
        orderDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer3._id,
        items: [
          {
            product: products[8]._id, // Chicken Burger
            quantity: 1,
            price: products[8].price,
          },
          {
            product: products[44]._id, // Onion Rings
            quantity: 1,
            price: products[44].price,
          },
        ],
        totalAmount: products[8].price + products[44].price,
        status: "cancelled",
        orderDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer5._id,
        items: [
          {
            product: products[20]._id, // Chocolate Brownie
            quantity: 3,
            price: products[20].price,
          },
          {
            product: products[16]._id, // Coca-Cola
            quantity: 3,
            price: products[16].price,
          },
        ],
        totalAmount: products[20].price * 3 + products[16].price * 3,
        status: "delivered",
        orderDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer6._id,
        items: [
          {
            product: products[40]._id, // Sushi Platter
            quantity: 2,
            price: products[40].price,
          },
          {
            product: products[42]._id, // Orange Chicken
            quantity: 1,
            price: products[42].price,
          },
        ],
        totalAmount: products[40].price * 2 + products[42].price,
        status: "delivered",
        orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        user: customer4._id,
        items: [
          {
            product: products[31]._id, // Meat Lovers Pizza
            quantity: 1,
            price: products[31].price,
          },
          {
            product: products[25]._id, // Chicken Wings
            quantity: 2,
            price: products[25].price,
          },
          {
            product: products[38]._id, // Apple Pie
            quantity: 1,
            price: products[38].price,
          },
        ],
        totalAmount:
          products[31].price + products[25].price * 2 + products[38].price,
        status: "pending",
        orderDate: new Date(Date.now() - 120 * 60 * 1000),
      },
      {
        user: customer7._id,
        items: [
          {
            product: products[10]._id, // Fettuccine Alfredo
            quantity: 1,
            price: products[10].price,
          },
          {
            product: products[21]._id, // Tiramisu
            quantity: 1,
            price: products[21].price,
          },
        ],
        totalAmount: products[10].price + products[21].price,
        status: "confirmed",
        orderDate: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
      {
        user: customer9._id,
        items: [
          {
            product: products[30]._id, // Beef Teriyaki
            quantity: 1,
            price: products[30].price,
          },
          {
            product: products[41]._id, // Ramen Bowl
            quantity: 1,
            price: products[41].price,
          },
        ],
        totalAmount: products[30].price + products[41].price,
        status: "delivered",
        orderDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Created ${orders.length} orders\n`);

    // Calculate total revenue
    const totalRevenue = orders.reduce(
      (sum, order) =>
        order.status !== "cancelled" ? sum + order.totalAmount : sum,
      0
    );

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("🎉 Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   👥 Users:          11 (1 admin, 10 customers)`);
    console.log(`   🍕 Categories:     ${categories.length}`);
    console.log(`   🍔 Products:       ${products.length}`);
    console.log(`   📦 Orders:         ${orders.length}`);
    console.log(`   💰 Total Revenue:  $${totalRevenue.toFixed(2)}`);
    console.log("═══════════════════════════════════════\n");

    console.log("📝 Test Credentials:");
    console.log("   🔐 Admin Account:");
    console.log("      Email: admin@fooddelivery.com");
    console.log("      Password: admin123");
    console.log("      Mobile: 1234567890");
    console.log("");
    console.log("   👤 Sample Customer Accounts:");
    console.log("      1. John Customer");
    console.log("         Email: john@example.com");
    console.log("         Password: password123");
    console.log("");
    console.log("      2. Jane Smith");
    console.log("         Email: jane@example.com");
    console.log("         Password: password123");
    console.log("");
    console.log("      3. Mike Wilson");
    console.log("         Email: mike@example.com");
    console.log("         Password: password123");
    console.log("");
    console.log("      4. Sarah Johnson");
    console.log("         Email: sarah@example.com");
    console.log("         Password: password123");
    console.log("");
    console.log("      5. David Brown");
    console.log("         Email: david@example.com");
    console.log("         Password: password123");
    console.log("");
    console.log("      ... and 5 more customer accounts!");
    console.log("═══════════════════════════════════════\n");

    console.log("🍕 Food Categories:");
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} - ${cat.description}`);
    });
    console.log("");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
  console.log(
    "✅ Seeding complete! You can now login and test the Food Delivery Admin Panel.\n"
  );
  process.exit(0);
};

runSeed();
