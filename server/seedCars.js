require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const Car = require("./models/car");

const cars = [
  {
    name: "Toyota Corolla",
    registrationNo: "CG-TC-001",
    brand: "Toyota",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 75,
    image: "Images/Cars/toyota-corolla.jpg",
    description: "A reliable and comfortable sedan for city driving, daily travel, and small family trips.",
    available: true
  },
  {
    name: "Hyundai Tucson",
    registrationNo: "CG-HT-002",
    brand: "Hyundai",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 105,
    image: "Images/Cars/hyundai-tucson.jpg",
    description: "A spacious SUV suitable for longer journeys, weekend trips, and comfortable highway driving.",
    available: true
  },
  {
    name: "Kia Carnival",
    registrationNo: "CG-KC-003",
    brand: "Kia",
    type: "Van",
    seats: 8,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 130,
    image: "Images/Cars/kia-carnival.jpg",
    description: "A roomy family van ideal for group travel, luggage, and airport transfers.",
    available: true
  },
  {
    name: "Toyota Camry",
    registrationNo: "CG-TCA-004",
    brand: "Toyota",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 95,
    image: "Images/Cars/toyota-camry.jpg",
    description: "A stylish and efficient sedan offering smooth performance, comfort, and low fuel consumption.",
    available: true
  },
  {
    name: "Toyota Crown",
    registrationNo: "CG-TCR-005",
    brand: "Toyota",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 140,
    image: "Images/Cars/toyota-crown.jpg",
    description: "A premium sedan with a refined interior, elegant styling, and a comfortable driving experience.",
    available: true
  },
  {
    name: "Toyota Land Cruiser",
    registrationNo: "CG-TLC-006",
    brand: "Toyota",
    type: "4WD SUV",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 180,
    image: "Images/Cars/toyota-land-cruiser.jpg",
    description: "A strong and capable SUV designed for family trips, long-distance travel, and rougher road conditions.",
    available: true
  },
  {
    name: "Mercedes-Benz E-Class",
    registrationNo: "CG-ME-007",
    brand: "Mercedes-Benz",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 210,
    image: "Images/Cars/mercedes-e-class.jpg",
    description: "A premium executive sedan that combines luxury, performance, and advanced comfort features.",
    available: true
  },
  {
    name: "BMW 5 Series",
    registrationNo: "CG-BMW-008",
    brand: "BMW",
    type: "Luxury Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 205,
    image: "Images/Cars/bmw-5-series.jpg",
    description: "A sporty and elegant luxury sedan that delivers a smooth ride and strong premium appeal.",
    available: true
  }
];

async function seedCars() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const car of cars) {
    await Car.findOneAndUpdate(
      { name: car.name },
      car,
      { upsert: true, returnDocument: "after", runValidators: true }
    );
  }

  console.log(`Seeded ${cars.length} cars`);
  await mongoose.disconnect();
}

seedCars().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
