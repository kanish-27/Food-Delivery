import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const baseUrl = "http://localhost:4000/api/food";

const images = {
    spring: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/spring_rolls_1766592233948.png",
    kathi: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/chicken_kathi_roll_1766592254293.png",
    sushi: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/veg_sushi_roll_1766592294736.png",
    egg: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/egg_roll_1766592311515.png",

    salad: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/salad_item_1766571166923.png",
    dessert: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/dessert_item_1766571196535.png",
};

const items = [
    { name: "Spring Rolls", price: 12, description: "Crispy golden rolls offered with dipping sauce", category: "Rolls", image: images.spring },
    { name: "Chicken Kathi Roll", price: 15, description: "Spicy chicken wrapped in toasted paratha", category: "Rolls", image: images.kathi },
    { name: "Veg Sushi Roll", price: 18, description: "Fresh vegetables wrapped in sushi rice and seaweed", category: "Rolls", image: images.sushi },
    { name: "Egg Roll", price: 10, description: "Classic street-style egg roll with veggies", category: "Rolls", image: images.egg },
    { name: "Paneer Tikka Roll", price: 14, description: "Grilled paneer cubes with spices in a roll", category: "Rolls", image: images.kathi },
    { name: "California Roll", price: 20, description: "Crab and avocado sushi roll", category: "Rolls", image: images.sushi },
    { name: "Dragon Roll", price: 22, description: "Eel and cucumber topped with avocado", category: "Rolls", image: images.sushi },
    { name: "Veggie Spring Roll", price: 11, description: "Light spring rolls with fresh vegetables", category: "Rolls", image: images.spring },
    { name: "Spicy Tuna Roll", price: 19, description: "Tuna with spicy mayo in a sushi roll", category: "Rolls", image: images.sushi },
    { name: "Sausage Roll", price: 13, description: "Savory sausage meat wrapped in puff pastry", category: "Rolls", image: images.egg },
    { name: "Greek Salad", price: 12, description: "Fresh mixed greens with feta cheese and olives", category: "Salad", image: images.salad },
    { name: "Chocolate Cake", price: 8, description: "Rich and moist chocolate layered cake", category: "Cake", image: images.dessert },
];

async function seed() {
    console.log("Starting add rolls...");
    for (const item of items) {
        try {
            const formData = new FormData();
            formData.append("name", item.name);
            formData.append("description", item.description);
            formData.append("price", item.price);
            formData.append("category", item.category);
            formData.append("image", fs.createReadStream(item.image));

            const response = await axios.post(`${baseUrl}/add`, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            console.log(`Added ${item.name}:`, response.data.message);
        } catch (error) {
            console.error(`Failed to add ${item.name}:`, error.message);
        }
    }
    console.log("Seeding rolls complete.");
}
seed();