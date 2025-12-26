import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const baseUrl = "http://localhost:4000/api/food";

const images = {
    // Original Unique Ones
    spring: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/spring_rolls_1766592233948.png",
    kathi: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/chicken_kathi_roll_1766592254293.png",
    sushi: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/veg_sushi_roll_1766592294736.png",
    egg: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/egg_roll_1766592311515.png",

    // NEW Unique Ones
    paneer: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/paneer_tikka_roll_unique_1766592592714.png",
    california: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/california_roll_unique_1766592609993.png",
    dragon: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/dragon_roll_unique_1766592627238.png",
    veggie_spring: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/veggie_spring_roll_unique_1766592644336.png",
    spicy_tuna: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/spicy_tuna_roll_unique_1766592660513.png",
    sausage: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/sausage_roll_unique_1766592709197.png"
};

const items = [
    { name: "Spring Rolls", price: 12, description: "Crispy golden rolls offered with dipping sauce", category: "Rolls", image: images.spring },
    { name: "Chicken Kathi Roll", price: 15, description: "Spicy chicken wrapped in toasted paratha", category: "Rolls", image: images.kathi },
    { name: "Veg Sushi Roll", price: 18, description: "Fresh vegetables wrapped in sushi rice and seaweed", category: "Rolls", image: images.sushi },
    { name: "Egg Roll", price: 10, description: "Classic street-style egg roll with veggies", category: "Rolls", image: images.egg },

    // Updated with unique images
    { name: "Paneer Tikka Roll", price: 14, description: "Grilled paneer cubes with spices in a roll", category: "Rolls", image: images.paneer },
    { name: "California Roll", price: 20, description: "Crab and avocado sushi roll", category: "Rolls", image: images.california },
    { name: "Dragon Roll", price: 22, description: "Eel and cucumber topped with avocado", category: "Rolls", image: images.dragon },
    { name: "Veggie Spring Roll", price: 11, description: "Light spring rolls with fresh vegetables", category: "Rolls", image: images.veggie_spring },
    { name: "Spicy Tuna Roll", price: 19, description: "Tuna with spicy mayo in a sushi roll", category: "Rolls", image: images.spicy_tuna },
    { name: "Sausage Roll", price: 13, description: "Savory sausage meat wrapped in puff pastry", category: "Rolls", image: images.sausage },
];

async function seed() {
    console.log("Starting unique rolls update...");

    // 1. Fetch current list to identify Rolls to remove first (to avoid having 20+ rolls)
    try {
        const listResponse = await axios.get(`${baseUrl}/list`);
        if (listResponse.data.success) {
            const allItems = listResponse.data.data;
            const rollsToRemove = allItems.filter(item => item.category === "Rolls");
            console.log(`Found ${rollsToRemove.length} existing Rolls to replace.`);

            for (const item of rollsToRemove) {
                await axios.post(`${baseUrl}/remove`, { id: item._id });
                // console.log(`Removed old: ${item.name}`); // commented to reduce noise
            }
        }
    } catch (error) {
        console.error("Error during cleanup:", error.message);
    }

    // 2. Add New Unique Rolls
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
            console.log(`Added Unique ${item.name}:`, response.data.message);
        } catch (error) {
            console.error(`Failed to add ${item.name}:`, error.message);
        }
    }
    console.log("Unique rolls update complete.");
}

seed();
