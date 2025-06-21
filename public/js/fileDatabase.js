/**
 * DareMate File-Based Database Module
 * Uses JSON files stored in the data directory instead of localStorage
 */
const FileDatabase = {
    // Database collections
    collections: ['rooms', 'players', 'messages', 'turns', 'questions'],
    
    // Cache for loaded data
    cache: {
        rooms: null,
        players: null,
        messages: null,
        turns: null,
        questions: null
    },
    
    // Base path for data files
    basePath: 'data',
    
    // Initialize the database
    async init() {
        console.log('Initializing file-based database...');
        
        // Create initial JSON files if they don't exist
        await createInitialJsonFiles();
        
        // Load all collections
        for (const collection of this.collections) {
            console.log(`Initializing collection: ${collection}`);
            await this.loadCollection(collection);
            console.log(`Loaded ${this.cache[collection]?.length || 0} items in ${collection}`);
        }
        
        // Log the state of the rooms collection
        const rooms = this.getAll('rooms');
        console.log(`After initialization: ${rooms.length} rooms found`);
        if (rooms.length > 0) {
            console.log('Room IDs:', rooms.map(room => room.room_id));
        }
        
        // Add sample questions if questions collection is empty
        const questions = this.getAll('questions');
        if (questions.length === 0) {
            await this.seedQuestions();
        }
        
        console.log('Database initialized successfully');
    },
    
    // Load a collection from file
    async loadCollection(collection) {
        console.log(`Loading collection: ${collection}`);
        try {
            const url = `${this.basePath}/${collection}/index.json`;
            console.log(`Fetching from URL: ${url}`);
            
            const response = await fetch(url);
            console.log(`Fetch response for ${collection}: status=${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Successfully loaded ${data.length} items from ${collection}`);
                this.cache[collection] = data;
            } else {
                console.warn(`Failed to load ${collection}: ${response.status} ${response.statusText}`);
                // If file doesn't exist or other error, initialize with empty array
                this.cache[collection] = [];
                // Save the empty collection to create the file
                await this.saveCollection(collection);
            }
        } catch (error) {
            console.error(`Error loading ${collection} collection:`, error);
            this.cache[collection] = [];
            // Save the empty collection to create the file
            await this.saveCollection(collection);
        } finally {
            // Ensure cache is initialized even if everything fails
            if (!this.cache[collection]) {
                console.warn(`Initializing ${collection} with empty array as a fallback`);
                this.cache[collection] = [];
            }
        }
    },
    
    // Save a collection to file
    async saveCollection(collection) {
        console.log(`Saving collection ${collection} (${this.cache[collection]?.length || 0} items)`);
        
        try {
            // Ensure cache exists for this collection
            if (!this.cache[collection]) {
                console.warn(`Cache for ${collection} doesn't exist. Initializing with empty array.`);
                this.cache[collection] = [];
            }
            
            const data = this.cache[collection];
            console.log(`Preparing to save ${data.length} items to ${collection}`);
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            
            // Using a server endpoint to save the file
            console.log(`Sending data to /api/save?collection=${collection}`);
            const response = await fetch(`/api/save?collection=${collection}`, options);
            
            if (!response.ok) {
                console.error(`Failed to save ${collection}: ${response.status} ${response.statusText}`);
                return false;
            }
            
            const result = await response.json();
            console.log(`Collection ${collection} saved successfully:`, result);
            return true;
        } catch (error) {
            console.error(`Error saving ${collection} collection:`, error);
            return false;
        }
    },
    
    // Get all items from a collection
    getAll(collection) {
        return this.cache[collection] || [];
    },
    
    // Get a single item by ID
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id);
    },
    
    // Get items by a field value
    getBy(collection, field, value) {
        console.log(`Searching in ${collection} for ${field}=${value}`);
        
        // Ensure cache is populated
        const items = this.getAll(collection);
        console.log(`Found ${items.length} items in ${collection}`);
        
        // Debug log all items
        if (field === 'room_id') {
            console.log('Available items:', items.map(item => ({ id: item.id, room_id: item.room_id })));
        }
        
        // Special handling for room_id - case insensitive
        if (field === 'room_id' && typeof value === 'string') {
            console.log(`Case insensitive search for room_id: ${value}`);
            
            // Clean up input value
            const normalizedValue = value.trim().toUpperCase();
            console.log(`Normalized room_id search value: "${normalizedValue}"`);
            
            const results = items.filter(item => {
                // Make sure the item has the field and handle case-insensitive comparison
                if (item[field] && typeof item[field] === 'string') {
                    const normalizedItem = item[field].trim().toUpperCase();
                    console.log(`Comparing: "${normalizedItem}" with "${normalizedValue}"`);
                    return normalizedItem === normalizedValue;
                }
                return false;
            });
            
            console.log(`Found ${results.length} matching items for room_id: ${normalizedValue}`);
            return results;
        }
        
        // Default filtering for other fields
        return items.filter(item => item[field] === value);
    },
    
    // Add an item to a collection
    async add(collection, item) {
        // Ensure the collection is loaded
        if (!this.cache[collection]) {
            await this.loadCollection(collection);
        }
        
        // Generate a unique ID if none provided
        if (!item.id) {
            item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
        
        // Add the item to the cache
        this.cache[collection].push(item);
        
        // Save the collection to disk
        await this.saveCollection(collection);
        
        return item;
    },
    
    // Update an item in a collection
    async update(collection, id, updates) {
        // Ensure the collection is loaded
        if (!this.cache[collection]) {
            await this.loadCollection(collection);
        }
        
        const index = this.cache[collection].findIndex(item => item.id === id);
        
        if (index !== -1) {
            this.cache[collection][index] = { ...this.cache[collection][index], ...updates };
            await this.saveCollection(collection);
            return this.cache[collection][index];
        }
        
        return null;
    },
    
    // Delete an item from a collection
    async delete(collection, id) {
        // Ensure the collection is loaded
        if (!this.cache[collection]) {
            await this.loadCollection(collection);
        }
        
        const filtered = this.cache[collection].filter(item => item.id !== id);
        this.cache[collection] = filtered;
        await this.saveCollection(collection);
        return filtered;
    },
    
    // Clear a collection
    async clear(collection) {
        this.cache[collection] = [];
        await this.saveCollection(collection);
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
    async seedQuestions() {
        console.log('Seeding questions...');
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
        for (const [category, questions] of Object.entries(questionTypes)) {
            for (const question of questions) {
                await this.add('questions', {
                    category,
                    type: question.type,
                    text: question.text
                });
            }
        }
        
        console.log('Questions seeded successfully');
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
    },
    
    // Check if a room exists - helper function for troubleshooting
    async checkRoom(roomId) {
        if (!roomId) {
            console.error('Room ID is required');
            return { exists: false, error: 'Room ID is required' };
        }
        
        const normalizedRoomId = roomId.trim().toUpperCase();
        console.log(`Checking if room exists: "${normalizedRoomId}"`);
        
        // Make sure rooms collection is loaded
        if (!this.cache.rooms) {
            console.log('Rooms collection not loaded. Loading now...');
            await this.loadCollection('rooms');
        }
        
        const rooms = this.getAll('rooms');
        console.log(`Total rooms: ${rooms.length}`);
        
        if (rooms.length > 0) {
            console.log('All room IDs:', rooms.map(room => room.room_id));
        }
        
        const matchingRooms = this.getBy('rooms', 'room_id', normalizedRoomId);
        
        if (matchingRooms.length === 0) {
            console.log(`Room "${normalizedRoomId}" not found`);
            return { exists: false, error: 'Room not found' };
        }
        
        const room = matchingRooms[0];
        console.log(`Room found:`, room);
        
        return {
            exists: true,
            active: room.active,
            room: room
        };
    }
};

// Create empty index files for each collection
async function createInitialJsonFiles() {
    for (const collection of FileDatabase.collections) {
        const path = `${FileDatabase.basePath}/${collection}/index.json`;
        try {
            const response = await fetch(path);
            if (!response.ok) {
                console.log(`Creating initial JSON file for ${collection}...`);
                await fetch(`/api/save?collection=${collection}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([])
                });
            }
        } catch (error) {
            console.log(`Error checking/creating ${path}:`, error);
        }
    }
}

// Export FileDatabase as the default Database
window.Database = FileDatabase; 