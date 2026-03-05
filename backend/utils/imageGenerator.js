const crypto = require("crypto");

// Image categories with emojis (for demo purposes - in production, use real image URLs)
const IMAGE_CATEGORIES = {
    animals: {
        name: "animals",
        items: [
            { emoji: "🐶", name: "dog", category: "animals" },
            { emoji: "🐱", name: "cat", category: "animals" },
            { emoji: "🐭", name: "mouse", category: "animals" },
            { emoji: "🐹", name: "hamster", category: "animals" },
            { emoji: "🐰", name: "rabbit", category: "animals" },
            { emoji: "🦊", name: "fox", category: "animals" },
            { emoji: "🐻", name: "bear", category: "animals" },
            { emoji: "🐼", name: "panda", category: "animals" },
            { emoji: "🐨", name: "koala", category: "animals" },
            { emoji: "🐯", name: "tiger", category: "animals" },
            { emoji: "🦁", name: "lion", category: "animals" },
            { emoji: "🐮", name: "cow", category: "animals" }
        ]
    },
    vehicles: {
        name: "vehicles",
        items: [
            { emoji: "🚗", name: "car", category: "vehicles" },
            { emoji: "🚕", name: "taxi", category: "vehicles" },
            { emoji: "🚙", name: "suv", category: "vehicles" },
            { emoji: "🚌", name: "bus", category: "vehicles" },
            { emoji: "🚎", name: "trolleybus", category: "vehicles" },
            { emoji: "🏎️", name: "race car", category: "vehicles" },
            { emoji: "🚓", name: "police car", category: "vehicles" },
            { emoji: "🚑", name: "ambulance", category: "vehicles" },
            { emoji: "🚒", name: "fireengine", category: "vehicles" },
            { emoji: "🚐", name: "minibus", category: "vehicles" },
            { emoji: "🚚", name: "truck", category: "vehicles" },
            { emoji: "🚛", name: "bigrig", category: "vehicles" }
        ]
    },
    food: {
        name: "food",
        items: [
            { emoji: "🍎", name: "apple", category: "food" },
            { emoji: "🍊", name: "orange", category: "food" },
            { emoji: "🍋", name: "lemon", category: "food" },
            { emoji: "🍌", name: "banana", category: "food" },
            { emoji: "🍉", name: "watermelon", category: "food" },
            { emoji: "🍇", name: "grapes", category: "food" },
            { emoji: "🍓", name: "strawberry", category: "food" },
            { emoji: "🍒", name: "cherries", category: "food" },
            { emoji: "🍑", name: "peach", category: "food" },
            { emoji: "🥝", name: "kiwi", category: "food" },
            { emoji: "🍍", name: "pineapple", category: "food" },
            { emoji: "🥭", name: "mango", category: "food" }
        ]
    },
    nature: {
        name: "nature",
        items: [
            { emoji: "🌸", name: "flower", category: "nature" },
            { emoji: "🌺", name: "hibiscus", category: "nature" },
            { emoji: "🌻", name: "sunflower", category: "nature" },
            { emoji: "🌹", name: "rose", category: "nature" },
            { emoji: "🌷", name: "tulip", category: "nature" },
            { emoji: "🌲", name: "tree", category: "nature" },
            { emoji: "🌳", name: "deciduous", category: "nature" },
            { emoji: "🌴", name: "palm", category: "nature" },
            { emoji: "🌵", name: "cactus", category: "nature" },
            { emoji: "🌾", name: "grain", category: "nature" },
            { emoji: "🍀", name: "clover", category: "nature" },
            { emoji: "🍁", name: "maple", category: "nature" }
        ]
    }
};

const DIFFICULTY_SETTINGS = {
    easy: {
        gridSize: 6,      // 2x3 grid
        correctCount: 2,   // Find 2 correct images
        distractorCategories: 1  // Items from 1 other category
    },
    medium: {
        gridSize: 9,       // 3x3 grid
        correctCount: 3,   // Find 3 correct images
        distractorCategories: 2  // Items from 2 other categories
    },
    hard: {
        gridSize: 12,      // 3x4 grid
        correctCount: 4,   // Find 4 correct images
        distractorCategories: 2  // Items from 2 other categories, more items
    }
};

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateImageCaptcha(difficulty = "easy") {
    const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.easy;
    
    // Select random target category
    const categoryKeys = Object.keys(IMAGE_CATEGORIES);
    const targetCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const targetCategory = IMAGE_CATEGORIES[targetCategoryKey];
    
    // Select correct images from target category
    const shuffledTarget = shuffleArray(targetCategory.items);
    const correctImages = shuffledTarget.slice(0, settings.correctCount);
    
    // Select distractor images from other categories
    const otherCategoryKeys = categoryKeys.filter(k => k !== targetCategoryKey);
    const distractorImages = [];
    
    const distractorCount = settings.gridSize - settings.correctCount;
    const perCategoryCount = Math.ceil(distractorCount / settings.distractorCategories);
    
    for (let i = 0; i < settings.distractorCategories && distractorImages.length < distractorCount; i++) {
        const distCatKey = otherCategoryKeys[i % otherCategoryKeys.length];
        const distCat = IMAGE_CATEGORIES[distCatKey];
        const shuffledDist = shuffleArray(distCat.items);
        const needed = Math.min(perCategoryCount, distractorCount - distractorImages.length);
        distractorImages.push(...shuffledDist.slice(0, needed));
    }
    
    // Combine and shuffle all images
    const allImages = [...correctImages, ...distractorImages];
    const shuffledImages = shuffleArray(allImages);
    
    // Find correct indexes in shuffled array
    const correctIndexes = [];
    shuffledImages.forEach((img, idx) => {
        if (correctImages.some(correct => correct.name === img.name)) {
            correctIndexes.push(idx);
        }
    });
    
    // Convert to image objects with URLs (using data URIs with emojis for demo)
    const images = shuffledImages.map(item => ({
        url: createEmojiDataUrl(item.emoji),
        name: item.name,
        category: item.category
    }));
    
    return {
        question: `Select all images showing ${targetCategory.name}`,
        images,
        correctIndexes,
        correctCount: settings.correctCount,
        gridSize: settings.gridSize,
        targetCategory: targetCategory.name,
        difficulty
    };
}

function createEmojiDataUrl(emoji) {
    // Create a simple SVG data URL with the emoji
    // In production, replace this with actual image URLs
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#f3f4f6" rx="8"/>
            <text x="50" y="50" font-size="48" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function verifyImageSelection(selectedIndexes, correctIndexes) {
    if (!selectedIndexes || !correctIndexes) return false;
    
    // Check if arrays have same length
    if (selectedIndexes.length !== correctIndexes.length) return false;
    
    // Check if all selected are correct (order doesn't matter)
    const selectedSet = new Set(selectedIndexes);
    const correctSet = new Set(correctIndexes);
    
    if (selectedSet.size !== correctSet.size) return false;
    
    for (const idx of selectedSet) {
        if (!correctSet.has(idx)) return false;
    }
    
    return true;
}

function calculateWrongSelections(selectedIndexes, correctIndexes) {
    const selectedSet = new Set(selectedIndexes);
    const correctSet = new Set(correctIndexes);
    
    let wrongCount = 0;
    
    // Count false positives (selected but not correct)
    for (const idx of selectedSet) {
        if (!correctSet.has(idx)) wrongCount++;
    }
    
    // Count false negatives (correct but not selected)
    for (const idx of correctSet) {
        if (!selectedSet.has(idx)) wrongCount++;
    }
    
    return wrongCount;
}

module.exports = {
    generateImageCaptcha,
    verifyImageSelection,
    calculateWrongSelections
};
