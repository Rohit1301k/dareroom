/**
 * DareMate Database Module
 * Uses localStorage as a simple JSON database
 */
const Database = {
    // Database collections
    collections: ['rooms', 'players', 'messages', 'turns', 'questions'],
    
    // Initialize the database
    init() {
        // Create collections if they don't exist
        this.collections.forEach(collection => {
            if (!localStorage.getItem(collection)) {
                localStorage.setItem(collection, JSON.stringify([]));
            }
        });
        
        // Add sample questions if none exist
        const questions = this.getAll('questions');
        if (questions.length === 0) {
            this.seedQuestions();
        }
    },
    
    // Get all items from a collection
    getAll(collection) {
        return JSON.parse(localStorage.getItem(collection)) || [];
    },
    
    // Get a single item by ID
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id);
    },
    
    // Get items by a field value
    getBy(collection, field, value) {
        const items = this.getAll(collection);
        
        // Special handling for room_id - case insensitive
        if (field === 'room_id' && typeof value === 'string') {
            return items.filter(item => {
                // Make sure the item has the field and handle case-insensitive comparison
                if (item[field] && typeof item[field] === 'string') {
                    return item[field].toUpperCase() === value.toUpperCase();
                }
                return false;
            });
        }
        
        // Default filtering for other fields
        return items.filter(item => item[field] === value);
    },
    
    // Add an item to a collection
    add(collection, item) {
        const items = this.getAll(collection);
        // Generate a unique ID if none provided
        if (!item.id) {
            item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
        items.push(item);
        localStorage.setItem(collection, JSON.stringify(items));
        return item;
    },
    
    // Update an item in a collection
    update(collection, id, updates) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            localStorage.setItem(collection, JSON.stringify(items));
            return items[index];
        }
        
        return null;
    },
    
    // Delete an item from a collection
    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        localStorage.setItem(collection, JSON.stringify(filtered));
        return filtered;
    },
    
    // Clear a collection
    clear(collection) {
        localStorage.setItem(collection, JSON.stringify([]));
    },
    
    // Generate a unique room ID
    generateRoomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Log the generated room ID for debugging
        console.log('Generated room ID:', result);
        
        // Check if this room ID already exists and regenerate if needed
        const existingRooms = this.getBy('rooms', 'room_id', result);
        if (existingRooms.length > 0) {
            console.log('Room ID collision, regenerating...');
            return this.generateRoomId(); // Regenerate if collision
        }
        
        return result;
    },
    
    // Seed questions for the game
    seedQuestions() {
        const questionTypes = {
            funny: [
                { type: 'truth', text: 'What is the most embarrassing thing you have ever done?' },
                { type: 'truth', text: 'What is the weirdest dream you have ever had?' },
                { type: 'truth', text: 'What is the most childish thing you still do?' },
                { type: 'dare', text: 'Do your best impression of another player.' },
                { type: 'dare', text: 'Send the 10th photo in your camera roll.' },
                { type: 'dare', text: 'Speak in an accent for the next three rounds.' }
            ],
            romantic: [
                { type: 'truth', text: 'Who was your first crush and what were they like?' },
                { type: 'truth', text: 'What is your idea of a perfect date?' },
                { type: 'truth', text: 'What is the most romantic thing someone has done for you?' },
                { type: 'dare', text: 'Write a short love poem about the person to your right.' },
                { type: 'dare', text: 'Send a romantic message to someone not in this game.' },
                { type: 'dare', text: 'Give a 30-second speech about why love is important.' }
            ],
            strip: [
                { type: 'truth', text: 'Have you ever been caught not fully dressed?' },
                { type: 'truth', text: 'What is the least amount of clothing you have worn in public?' },
                { type: 'truth', text: 'Have you ever gone skinny dipping?' },
                { type: 'dare', text: 'Remove one item of clothing for one round.' },
                { type: 'dare', text: 'Show everyone your tan lines if you have any.' },
                { type: 'dare', text: 'Play the next round with your shirt turned inside out.' }
            ],
            '18+': [
                { type: 'truth', text: 'What is your biggest turn-on?' },
                { type: 'truth', text: 'What is your wildest fantasy?' },
                { type: 'truth', text: 'Where is the strangest place you have been intimate?' },
                { type: 'dare', text: 'Demonstrate your go-to bedroom move on a pillow.' },
                { type: 'dare', text: 'Send the last spicy text you sent or received (blur out names).' },
                { type: 'dare', text: 'Describe in detail the most intimate experience you have had.' }
            ],
            emotional: [
                { type: 'truth', text: 'What is something you are afraid to tell people?' },
                { type: 'truth', text: 'When was the last time you cried and why?' },
                { type: 'truth', text: 'What is the biggest mistake you have made in a relationship?' },
                { type: 'dare', text: 'Call someone you miss and tell them you are thinking of them.' },
                { type: 'dare', text: 'Share a personal insecurity with the group.' },
                { type: 'dare', text: 'Write a heartfelt anonymous compliment to each player.' }
            ]
        };
        
        // Add all questions to the database
        Object.entries(questionTypes).forEach(([category, questions]) => {
            questions.forEach(question => {
                this.add('questions', {
                    category,
                    type: question.type,
                    text: question.text
                });
            });
        });
    },
    
    // Get random questions based on categories and type
    getRandomQuestion(categories, type = null) {
        const allQuestions = this.getAll('questions');
        const filteredQuestions = allQuestions.filter(q => 
            categories.includes(q.category) && 
            (type === null || q.type === type)
        );
        
        if (filteredQuestions.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        return filteredQuestions[randomIndex];
    },
    
    // Debug function to list all rooms
    debugListRooms() {
        const rooms = this.getAll('rooms');
        console.log('===== ALL ROOMS =====');
        if (rooms.length === 0) {
            console.log('No rooms found in database');
        } else {
            rooms.forEach(room => {
                console.log(`Room ID: ${room.room_id} | Type: ${room.type} | Active: ${room.active}`);
                const players = this.getBy('players', 'room_id', room.room_id)
                    .filter(player => player.active);
                console.log(`Active Players: ${players.length}`);
                players.forEach(player => {
                    console.log(`- ${player.nickname} ${player.is_host ? '(Host)' : ''}`);
                });
                console.log('-----------------');
            });
        }
        console.log('=====================');
        return rooms.length;
    }
};

// Initialize the database when the script loads
Database.init(); 