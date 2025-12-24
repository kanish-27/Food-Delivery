import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const baseUrl = "http://localhost:4000/api/food"; // Changed to base URL

const images = {
    // Specifics
    greek: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/greek_salad_1766571478626.png",
    caesar: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/caesar_salad_1766571495943.png",
    tuna: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/tuna_salad_1766571539096.png",
    coleslaw: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/coleslaw_1766571559519.png",

    choc_cake: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/chocolate_cake_1766571597043.png",
    grilled: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/grilled_sandwich_1766571615652.png",
    alfredo: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/chicken_alfredo_1766571634671.png",
    burger_classic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/classic_burger_1766571653467.png",

    // Generics (Fallbacks)
    salad_generic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/salad_item_1766571166923.png",
    dessert_generic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/dessert_item_1766571196535.png",
    sandwich_generic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/sandwich_item_1766571214773.png",
    pasta_generic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/pasta_item_1766571231491.png",
    burger_generic: "C:/Users/Jaikumar/.gemini/antigravity/brain/42c55503-6364-42c3-8fd3-555b196800d8/burger_item_1766571248915.png"
};

const items = [
    { name: "Greek Salad", price: 12, description: "Fresh mixed greens with feta cheese and olives", category: "Salad", image: images.greek },
    { name: "Caesar Salad", price: 10, description: "Crisp romaine lettuce with parmesan and croutons", category: "Salad", image: images.caesar },
    { name: "Tuna Salad", price: 14, description: "Hearty salad with tuna, beans, and corn", category: "Salad", image: images.tuna },
    { name: "Coleslaw", price: 6, description: "Crunchy cabbage and carrot crisp salad", category: "Salad", image: images.coleslaw },

    { name: "Chocolate Cake", price: 8, description: "Rich and moist chocolate layered cake", category: "Cake", image: images.choc_cake },
    { name: "Red Velvet Cake", price: 9, description: "Classic red velvet cake with cream cheese frosting", category: "Cake", image: images.dessert_generic },
    { name: "Cheesecake", price: 9, description: "Creamy New York style cheesecake", category: "Cake", image: images.dessert_generic },
    { name: "Brownie", price: 5, description: "Fudgy chocolate brownie with walnuts", category: "Deserts", image: images.choc_cake },

    { name: "Grilled Sandwich", price: 7, description: "Toasted sandwich with melted cheese and veggies", category: "Sandwich", image: images.grilled },
    { name: "Club Sandwich", price: 11, description: "Triple layered sandwich with chicken and bacon", category: "Sandwich", image: images.sandwich_generic },
    { name: "Veggie Sandwich", price: 6, description: "Healthy sandwich with fresh garden vegetables", category: "Sandwich", image: images.sandwich_generic },
    { name: "Chicken Sandwich", price: 9, description: "Grilled seasoned chicken breast sandwich", category: "Sandwich", image: images.grilled },

    { name: "Chicken Alfredo", price: 15, description: "Creamy fettuccine pasta with grilled chicken", category: "Pasta", image: images.alfredo },
    { name: "Spaghetti Bolognese", price: 13, description: "Classic spaghetti with meat sauce", category: "Pasta", image: images.pasta_generic },
    { name: "Carbonara", price: 14, description: "Pasta with egg, cheese, pancetta, and pepper", category: "Pasta", image: images.alfredo },
    { name: "Mac & Cheese", price: 10, description: "Cheesy baked macaroni pasta", category: "Pasta", image: images.pasta_generic },

    { name: "Classic Burger", price: 10, description: "Beef patty with lettuce, tomato, and onion", category: "Sandwich", image: images.burger_classic },
    { name: "Cheese Burger", price: 11, description: "Classic burger with melted cheddar cheese", category: "Sandwich", image: images.burger_classic },
    { name: "Bacon Burger", price: 13, description: "Burger topped with crispy bacon strips", category: "Sandwich", image: images.burger_generic },
    { name: "Veggie Burger", price: 9, description: "Plant-based patty with fresh toppings", category: "Sandwich", image: images.burger_generic }
];

async function seed() {
    console.log("Starting cleanup and seed...");

    // 1. Cleanup existing items
    try {
        const listResponse = await axios.get(`${baseUrl}/list`);
        if (listResponse.data.success) {
            const existingItems = listResponse.data.data;
            console.log(`Found ${existingItems.length} existing items to remove.`);

            for (const item of existingItems) {
                await axios.post(`${baseUrl}/remove`, { id: item._id });
                console.log(`Removed: ${item.name}`);
            }
        }
    } catch (error) {
        console.error("Error during cleanup:", error.message);
    }

    console.log("Cleanup complete. Starting seed...");

    // 2. Add new items
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
    console.log("Seeding complete.");
}

seed();
