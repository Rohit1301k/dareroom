/**
 * DareMate Main Application
 */

// UI Components and Rendering
const UI = {
    // Main content container
    contentEl: document.getElementById('content'),
    
    // Clear the content container
    clear() {
        this.contentEl.innerHTML = '';
    },
    
    // Render a component to the content container
    render(component) {
        this.clear();
        this.contentEl.appendChild(component);
    },
    
    // Create an element with classes and attributes
    createElement(tag, classes = [], attributes = {}) {
        const element = document.createElement(tag);
        
        // Add classes
        if (classes.length) {
            element.classList.add(...classes);
        }
        
        // Add attributes
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        return element;
    },
    
    // Show a notification
    showNotification(message, type = 'info') {
        const notification = this.createElement('div', [
            'fixed', 'bottom-4', 'right-4', 'p-4', 'rounded-lg', 'shadow-lg',
            'animate-slide-in', 'z-50',
            type === 'error' ? 'bg-red-600' : 'bg-purple-600'
        ]);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    },
    
    // Show loading indicator
    showLoading() {
        this.clear();
        const loading = this.createElement('div', ['py-20', 'text-center']);
        loading.innerHTML = '<i class="fas fa-spinner fa-spin text-4xl text-purple-500"></i>';
        this.contentEl.appendChild(loading);
    }
};

// Game Components
const Components = {
    // Homepage component
    homepage() {
        const container = UI.createElement('div', [
            'flex', 'flex-col', 'items-center', 'justify-center', 'h-screen',
            'animate-fade-in', 'p-4'
        ]);
        
        // Logo/Title
        const logo = UI.createElement('h1', [
            'text-5xl', 'font-bold', 'mb-6', 'text-purple-500'
        ]);
        logo.innerHTML = 'Dare<span class="text-white">Mate</span>';
        
        // Subtitle
        const subtitle = UI.createElement('p', [
            'text-xl', 'text-gray-400', 'mb-10', 'text-center'
        ]);
        subtitle.textContent = 'The Ultimate Truth or Dare Game';
        
        // Buttons container
        const btnContainer = UI.createElement('div', [
            'flex', 'flex-col', 'space-y-4', 'w-full', 'max-w-xs'
        ]);
        
        // Create Room button
        const createBtn = UI.createElement('button', [
            'bg-purple-600', 'hover:bg-purple-700', 'text-white', 'py-3', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover', 'w-full',
            'flex', 'items-center', 'justify-center'
        ]);
        createBtn.innerHTML = '<i class="fas fa-plus mr-2"></i> Create Room';
        createBtn.addEventListener('click', () => Game.navigateTo('createRoom'));
        
        // Join Room button
        const joinBtn = UI.createElement('button', [
            'bg-gray-700', 'hover:bg-gray-600', 'text-white', 'py-3', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover', 'w-full',
            'flex', 'items-center', 'justify-center'
        ]);
        joinBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Join Room';
        joinBtn.addEventListener('click', () => Game.navigateTo('joinRoom'));
        
        // Add buttons to container
        btnContainer.appendChild(createBtn);
        btnContainer.appendChild(joinBtn);
        
        // How to Play button
        const howToPlayBtn = UI.createElement('button', [
            'mt-10', 'text-gray-400', 'hover:text-white', 'flex', 'items-center'
        ]);
        howToPlayBtn.innerHTML = '<i class="fas fa-question-circle mr-2"></i> How to Play';
        howToPlayBtn.addEventListener('click', () => Game.showInstructions());
        
        // Add all elements to container
        container.appendChild(logo);
        container.appendChild(subtitle);
        container.appendChild(btnContainer);
        container.appendChild(howToPlayBtn);
        
        // Developer dashboard link (discrete, at the bottom)
        const footer = UI.createElement('div', [
            'fixed', 'bottom-2', 'right-2', 'text-xs', 'text-gray-600'
        ]);
        
        const devLink = UI.createElement('a', [
            'hover:text-gray-400', 'transition-colors'
        ], {
            href: 'dev.html',
            title: 'Developer Dashboard'
        });
        devLink.textContent = 'Dev';
        
        footer.appendChild(devLink);
        container.appendChild(footer);
        
        return container;
    },
    
    // Create room component
    createRoom() {
        const container = UI.createElement('div', [
            'flex', 'flex-col', 'items-center', 'justify-center',
            'animate-fade-in', 'p-4', 'max-w-md', 'mx-auto'
        ]);
        
        // Title
        const title = UI.createElement('h2', [
            'text-3xl', 'font-bold', 'mb-6', 'text-center'
        ]);
        title.textContent = 'Create a New Room';
        
        // Form
        const form = UI.createElement('form', [
            'w-full', 'space-y-6', 'card', 'p-6'
        ]);
        
        // Nickname field
        const nicknameGroup = UI.createElement('div', ['space-y-2']);
        const nicknameLabel = UI.createElement('label', ['text-gray-300']);
        nicknameLabel.textContent = 'Your Nickname';
        const nicknameInput = UI.createElement('input', [
            'w-full', 'bg-gray-800', 'text-white', 'p-3', 'rounded-lg', 'border',
            'border-gray-700', 'focus:border-purple-500', 'focus:outline-none'
        ], {
            type: 'text',
            placeholder: 'Enter your nickname',
            required: 'true',
            id: 'nickname',
            maxlength: '15'
        });
        nicknameGroup.appendChild(nicknameLabel);
        nicknameGroup.appendChild(nicknameInput);
        
        // Room type selection
        const typeGroup = UI.createElement('div', ['space-y-2']);
        const typeLabel = UI.createElement('label', ['text-gray-300']);
        typeLabel.textContent = 'Room Type';
        const typeSelect = UI.createElement('select', [
            'w-full', 'bg-gray-800', 'text-white', 'p-3', 'rounded-lg', 'border',
            'border-gray-700', 'focus:border-purple-500', 'focus:outline-none'
        ], {
            id: 'roomType',
            required: 'true'
        });
        
        // Room type options
        const types = [
            { value: 'partner', text: 'Partner (2 people)' },
            { value: 'friends', text: 'Friends (3-5 people)' },
            { value: 'group', text: 'Group (5+ people)' }
        ];
        
        types.forEach(type => {
            const option = UI.createElement('option', [], { value: type.value });
            option.textContent = type.text;
            typeSelect.appendChild(option);
        });
        
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // Categories selection
        const categoriesGroup = UI.createElement('div', ['space-y-2']);
        const categoriesLabel = UI.createElement('label', ['text-gray-300']);
        categoriesLabel.textContent = 'Question Categories';
        const categoriesContainer = UI.createElement('div', [
            'grid', 'grid-cols-2', 'gap-2'
        ]);
        
        const categories = [
            { id: 'funny', label: 'Funny' },
            { id: 'romantic', label: 'Romantic' },
            { id: 'strip', label: 'Strip' },
            { id: '18+', label: '18+' },
            { id: 'emotional', label: 'Emotional' }
        ];
        
        categories.forEach(category => {
            const checkboxContainer = UI.createElement('div', [
                'flex', 'items-center', 'space-x-2', 'bg-gray-800', 'p-2', 'rounded-lg'
            ]);
            
            const checkbox = UI.createElement('input', [], {
                type: 'checkbox',
                id: `category-${category.id}`,
                value: category.id
            });
            
            const label = UI.createElement('label', ['cursor-pointer', 'flex-1'], {
                for: `category-${category.id}`
            });
            label.textContent = category.label;
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            categoriesContainer.appendChild(checkboxContainer);
        });
        
        categoriesGroup.appendChild(categoriesLabel);
        categoriesGroup.appendChild(categoriesContainer);
        
        // Create button
        const createBtn = UI.createElement('button', [
            'bg-purple-600', 'hover:bg-purple-700', 'text-white', 'py-3', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover', 'w-full',
            'flex', 'items-center', 'justify-center'
        ], {
            type: 'submit'
        });
        createBtn.innerHTML = '<i class="fas fa-gamepad mr-2"></i> Create Room';
        
        // Back button
        const backBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'mt-4', 'flex', 'items-center',
            'mx-auto'
        ], {
            type: 'button'
        });
        backBtn.innerHTML = '<i class="fas fa-arrow-left mr-2"></i> Back to Home';
        backBtn.addEventListener('click', () => Game.navigateTo('home'));
        
        // Add all form elements
        form.appendChild(nicknameGroup);
        form.appendChild(typeGroup);
        form.appendChild(categoriesGroup);
        form.appendChild(createBtn);
        
        // Form submission
        form.addEventListener('submit', event => {
            event.preventDefault();
            
            // Get selected categories
            const selectedCategories = [];
            categories.forEach(category => {
                const checkbox = document.getElementById(`category-${category.id}`);
                if (checkbox.checked) {
                    selectedCategories.push(category.id);
                }
            });
            
            // Validation
            if (selectedCategories.length === 0) {
                UI.showNotification('Please select at least one category', 'error');
                return;
            }
            
            // Create room
            Game.createRoom({
                nickname: nicknameInput.value,
                roomType: typeSelect.value,
                categories: selectedCategories
            });
        });
        
        // Add form and back button to container
        container.appendChild(title);
        container.appendChild(form);
        container.appendChild(backBtn);
        
        return container;
    },
    
    // Join room component
    joinRoom() {
        const container = UI.createElement('div', [
            'flex', 'flex-col', 'items-center', 'justify-center',
            'animate-fade-in', 'p-4', 'max-w-md', 'mx-auto'
        ]);
        
        // Title
        const title = UI.createElement('h2', [
            'text-3xl', 'font-bold', 'mb-6', 'text-center'
        ]);
        title.textContent = 'Join a Room';
        
        // Form
        const form = UI.createElement('form', [
            'w-full', 'space-y-6', 'card', 'p-6'
        ]);
        
        // Nickname field
        const nicknameGroup = UI.createElement('div', ['space-y-2']);
        const nicknameLabel = UI.createElement('label', ['text-gray-300']);
        nicknameLabel.textContent = 'Your Nickname';
        const nicknameInput = UI.createElement('input', [
            'w-full', 'bg-gray-800', 'text-white', 'p-3', 'rounded-lg', 'border',
            'border-gray-700', 'focus:border-purple-500', 'focus:outline-none'
        ], {
            type: 'text',
            placeholder: 'Enter your nickname',
            required: 'true',
            id: 'join-nickname',
            maxlength: '15'
        });
        nicknameGroup.appendChild(nicknameLabel);
        nicknameGroup.appendChild(nicknameInput);
        
        // Room ID field
        const roomIdGroup = UI.createElement('div', ['space-y-2']);
        const roomIdLabel = UI.createElement('label', ['text-gray-300']);
        roomIdLabel.textContent = 'Room Code';
        const roomIdInput = UI.createElement('input', [
            'w-full', 'bg-gray-800', 'text-white', 'p-3', 'rounded-lg', 'border',
            'border-gray-700', 'focus:border-purple-500', 'focus:outline-none',
            'uppercase'
        ], {
            type: 'text',
            placeholder: 'Enter room code (6 characters)',
            required: 'true',
            id: 'room-id',
            maxlength: '6',
            minlength: '6',
            pattern: '[A-Za-z0-9]{6}'
        });
        
        // Input formatting for room code
        roomIdInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
        
        roomIdGroup.appendChild(roomIdLabel);
        roomIdGroup.appendChild(roomIdInput);
        
        // Error message container
        const errorMsg = UI.createElement('div', ['text-red-500', 'text-sm', 'hidden']);
        errorMsg.id = 'error-message';
        roomIdGroup.appendChild(errorMsg);
        
        // Join button
        const joinBtn = UI.createElement('button', [
            'bg-purple-600', 'hover:bg-purple-700', 'text-white', 'py-3', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover', 'w-full',
            'flex', 'items-center', 'justify-center'
        ], {
            type: 'submit'
        });
        joinBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Join Room';
        
        // Back button
        const backBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'mt-4', 'flex', 'items-center',
            'mx-auto'
        ], {
            type: 'button'
        });
        backBtn.innerHTML = '<i class="fas fa-arrow-left mr-2"></i> Back to Home';
        backBtn.addEventListener('click', () => Game.navigateTo('home'));
        
        // Debug button (only in development)
        const debugContainer = UI.createElement('div', [
            'mt-6', 'text-center', 'text-xs', 'text-gray-600'
        ]);
        
        const debugBtn = UI.createElement('button', [
            'text-gray-500', 'hover:text-gray-300', 'text-xs', 'underline'
        ]);
        debugBtn.textContent = 'Room Connection Troubleshooter';
        debugBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const count = Database.debugListRooms();
            UI.showNotification(`Found ${count} room(s) in database. Check console for details.`);
            
            // Extra check for entered room ID
            const roomId = roomIdInput.value.trim().toUpperCase();
            if (roomId) {
                const rooms = Database.getBy('rooms', 'room_id', roomId);
                console.log(`Specifically checking for room ID: ${roomId}`);
                console.log(`Found: ${rooms.length} matches`);
                if (rooms.length > 0) {
                    console.log('Room details:', rooms[0]);
                }
            }
        });
        
        debugContainer.appendChild(debugBtn);
        
        // Add form elements
        form.appendChild(nicknameGroup);
        form.appendChild(roomIdGroup);
        form.appendChild(joinBtn);
        
        // Check if room exists
        const checkRoom = () => {
            const roomId = roomIdInput.value.trim().toUpperCase();
            const errorElement = document.getElementById('error-message');
            
            if (roomId.length === 6) {
                // Check if room exists
                const rooms = Database.getBy('rooms', 'room_id', roomId);
                
                if (rooms.length === 0) {
                    errorElement.textContent = 'Room not found. Please check the code.';
                    errorElement.classList.remove('hidden');
                } else if (!rooms[0].active) {
                    errorElement.textContent = 'This room is no longer active.';
                    errorElement.classList.remove('hidden');
                } else {
                    errorElement.classList.add('hidden');
                }
            }
        };
        
        // Add blur event to check room
        roomIdInput.addEventListener('blur', checkRoom);
        
        // Form submission
        form.addEventListener('submit', event => {
            event.preventDefault();
            
            const nickname = nicknameInput.value.trim();
            const roomId = roomIdInput.value.trim().toUpperCase();
            
            if (!nickname || !roomId) {
                return;
            }
            
            // Join room
            Game.joinRoom({
                nickname: nickname,
                roomId: roomId
            });
        });
        
        // Add all elements to container
        container.appendChild(title);
        container.appendChild(form);
        container.appendChild(backBtn);
        container.appendChild(debugContainer);
        
        return container;
    },
    
    // Game room component
    gameRoom() {
        const container = UI.createElement('div', [
            'flex', 'flex-col', 'h-screen', 'animate-fade-in'
        ]);
        
        // Header with room info
        const header = UI.createElement('header', [
            'bg-gray-800', 'p-4', 'flex', 'justify-between', 'items-center',
            'border-b', 'border-gray-700'
        ]);
        
        // Room code display
        const roomInfo = UI.createElement('div', ['flex', 'items-center']);
        const roomCode = UI.createElement('span', [
            'bg-purple-900', 'text-white', 'px-3', 'py-1', 'rounded-lg',
            'font-mono', 'text-sm', 'mr-2'
        ]);
        roomCode.textContent = Game.room.room_id;
        const copyBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'text-sm'
        ], {
            title: 'Copy Room Code'
        });
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(Game.room.room_id)
                .then(() => UI.showNotification('Room code copied to clipboard!'))
                .catch(() => UI.showNotification('Failed to copy room code', 'error'));
        });
        
        // Refresh button for data
        const refreshBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'text-sm', 'ml-2'
        ], {
            title: 'Refresh Players Data'
        });
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshBtn.addEventListener('click', () => {
            UI.showNotification('Refreshing data...');
            Game.refreshGameData();
        });
        
        roomInfo.appendChild(roomCode);
        roomInfo.appendChild(copyBtn);
        roomInfo.appendChild(refreshBtn);
        
        // Player info and menu
        const playerInfo = UI.createElement('div', ['flex', 'items-center']);
        const playerName = UI.createElement('span', ['text-gray-300', 'mr-3']);
        playerName.textContent = Game.player.nickname;
        
        const menuBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white'
        ]);
        menuBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
        menuBtn.addEventListener('click', () => Game.toggleMenu());
        
        playerInfo.appendChild(playerName);
        playerInfo.appendChild(menuBtn);
        
        header.appendChild(roomInfo);
        header.appendChild(playerInfo);
        
        // Main content area with game display and chat
        const main = UI.createElement('div', [
            'flex', 'flex-col', 'flex-1', 'overflow-hidden'
        ]);
        
        // Game area
        const gameArea = UI.createElement('div', [
            'flex-1', 'p-4', 'flex', 'flex-col', 'overflow-y-auto'
        ]);
        gameArea.id = 'game-area';
        
        // Players list
        const playersList = UI.createElement('div', [
            'grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-3', 'mb-6'
        ]);
        playersList.id = 'players-list';
        
        // Game status/turn display
        const gameStatus = UI.createElement('div', [
            'card', 'p-3', 'flex', 'flex-col', 'items-center', 'text-center',
            'my-4'
        ]);
        gameStatus.id = 'game-status';
        
        // Question display
        const questionDisplay = UI.createElement('div', [
            'card', 'p-3', 'my-4', 'text-center', 'hidden'
        ]);
        questionDisplay.id = 'question-display';
        
        // Truth or Dare buttons
        const truthDareBtns = UI.createElement('div', [
            'flex', 'justify-center', 'space-x-4', 'my-4', 'hidden'
        ]);
        truthDareBtns.id = 'truth-dare-btns';
        
        // Truth button
        const truthBtn = UI.createElement('button', [
            'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'py-2', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover'
        ]);
        truthBtn.textContent = 'Truth';
        truthBtn.addEventListener('click', () => Game.selectChoice('truth'));
        
        // Dare button
        const dareBtn = UI.createElement('button', [
            'bg-red-600', 'hover:bg-red-700', 'text-white', 'py-2', 'px-6',
            'rounded-full', 'font-bold', 'shadow-lg', 'btn-hover'
        ]);
        dareBtn.textContent = 'Dare';
        dareBtn.addEventListener('click', () => Game.selectChoice('dare'));
        
        truthDareBtns.appendChild(truthBtn);
        truthDareBtns.appendChild(dareBtn);
        
        // Add game elements to game area
        gameArea.appendChild(playersList);
        gameArea.appendChild(gameStatus);
        gameArea.appendChild(truthDareBtns);
        gameArea.appendChild(questionDisplay);
        
        // Chat area (fixed position on mobile, right side on desktop)
        const chatArea = UI.createElement('div', [
            'flex', 'flex-col', 'bg-gray-800',
            'md:border-l', 'md:w-1/3'
        ]);
        chatArea.id = 'chat-area';
        
        // Chat header
        const chatHeader = UI.createElement('div', [
            'chat-header-mobile'
        ]);
        const chatTitle = UI.createElement('h3');
        chatTitle.textContent = 'Chat';
        
        // Chat toggle button
        const chatToggle = UI.createElement('button', [
            'chat-toggle-btn'
        ]);
        chatToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        chatToggle.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                const isExpanded = chatArea.classList.contains('h-64');
                const gameArea = document.getElementById('game-area');
                const gameAreaScrollPos = gameArea.scrollTop;

                if (isExpanded) {
                    // Minimize
                    chatArea.classList.remove('h-64');
                    chatArea.classList.add('h-12');
                    chatMessages.classList.add('hidden');
                    chatInputArea.classList.add('hidden');
                    chatToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
                    main.classList.remove('chat-expanded');
                    
                    // After transition, restore game area scroll position
                    setTimeout(() => {
                        gameArea.scrollTop = gameAreaScrollPos;
                    }, 300);
                } else {
                    // Store current game area scroll position
                    const currentGameAreaScrollPos = gameArea.scrollTop;
                    
                    // Expand
                    chatArea.classList.remove('h-12');
                    chatArea.classList.add('h-64');
                    chatMessages.classList.remove('hidden');
                    chatInputArea.classList.remove('hidden');
                    chatToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    main.classList.add('chat-expanded');
                    
                    // Smooth scroll game area to show current content
                    requestAnimationFrame(() => {
                        const maxScroll = gameArea.scrollHeight - gameArea.clientHeight;
                        const targetScroll = Math.min(currentGameAreaScrollPos, maxScroll);
                        gameArea.scrollTop = targetScroll;
                        
                        // Scroll chat to bottom
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    });
                }
            }
        });
        
        chatHeader.appendChild(chatTitle);
        chatHeader.appendChild(chatToggle);
        
        // Chat messages container
        const chatMessages = UI.createElement('div', [
            'flex-1', 'overflow-y-auto'
        ]);
        chatMessages.id = 'chat-messages';
        
        // Chat input area
        const chatInputArea = UI.createElement('div', [
            'chat-input-area'
        ]);
        
        const chatForm = UI.createElement('form', [
            'flex', 'w-full', 'items-center', 'gap-2'
        ]);

        // Media upload button
        const mediaBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'p-1', 'rounded-full',
            'hover:bg-gray-700', 'transition-colors'
        ], {
            type: 'button',
            title: 'Upload media'
        });
        mediaBtn.innerHTML = '<i class="fas fa-image"></i>';
        
        // Hidden file input
        const fileInput = UI.createElement('input', [], {
            type: 'file',
            accept: 'image/*',
            style: 'display: none;',
            id: 'media-upload'
        });
        
        // Emoji button
        const emojiBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'p-2', 'rounded-full',
            'hover:bg-gray-700', 'transition-colors'
        ], {
            type: 'button',
            title: 'Insert emoji'
        });
        emojiBtn.innerHTML = '<i class="far fa-smile"></i>';
        
        // GIF button
        const gifBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white', 'p-2', 'rounded-full',
            'hover:bg-gray-700', 'transition-colors'
        ], {
            type: 'button',
            title: 'Search GIFs'
        });
        gifBtn.innerHTML = '<i class="fas fa-photo-film"></i>';
        
        // Chat input
        const chatInput = UI.createElement('input', [], {
            type: 'text',
            placeholder: 'Type a message...',
            id: 'chat-input'
        });
        
        // Send button
        const sendBtn = UI.createElement('button', [
            'bg-purple-600', 'hover:bg-purple-700', 'text-white',
            'rounded-full', 'w-10', 'h-10', 'flex', 'items-center',
            'justify-center', 'transition-colors'
        ], {
            type: 'submit'
        });
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';

        // Emoji picker container
        const emojiPicker = UI.createElement('div', [
            'absolute', 'bottom-full', 'left-0', 'mb-2', 'bg-gray-800',
            'rounded-lg', 'shadow-lg', 'p-2', 'hidden', 'z-50',
            'max-h-[300px]', 'overflow-y-auto', 'grid', 'grid-cols-8',
            'gap-1'
        ]);
        emojiPicker.id = 'emoji-picker';

        // Add common emojis
        const commonEmojis = ['😀', '😂', '🥰', '😎', '😊', '🤔', '😴', '😭', 
                            '👍', '👎', '👋', '🙌', '👏', '🎉', '❤️', '🔥',
                            '⭐', '🌟', '💯', '🎮', '🎲', '🎪', '🎭', '🎨'];
        
        commonEmojis.forEach(emoji => {
            const emojiBtn = UI.createElement('button', [
                'w-8', 'h-8', 'flex', 'items-center', 'justify-center',
                'hover:bg-gray-700', 'rounded', 'text-xl'
            ], {
                type: 'button'
            });
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                chatInput.value += emoji;
                emojiPicker.classList.add('hidden');
                chatInput.focus();
            });
            emojiPicker.appendChild(emojiBtn);
        });

        // GIF picker container
        const gifPicker = UI.createElement('div', [
            'absolute', 'bottom-full', 'left-0', 'mb-2', 'bg-gray-800',
            'rounded-lg', 'shadow-lg', 'p-2', 'hidden', 'z-50',
            'w-[320px]'
        ]);
        gifPicker.id = 'gif-picker';

        // GIF search input
        const gifSearchContainer = UI.createElement('div', [
            'flex', 'items-center', 'gap-2', 'mb-2'
        ]);

        const gifSearchInput = UI.createElement('input', [
            'flex-1', 'bg-gray-700', 'text-white', 'p-2', 'rounded',
            'border', 'border-gray-600', 'text-sm'
        ], {
            type: 'text',
            placeholder: 'Search GIFs...'
        });

        const gifSearchBtn = UI.createElement('button', [
            'bg-purple-600', 'hover:bg-purple-700', 'text-white',
            'p-2', 'rounded', 'text-sm'
        ]);
        gifSearchBtn.innerHTML = '<i class="fas fa-search"></i>';

        gifSearchContainer.appendChild(gifSearchInput);
        gifSearchContainer.appendChild(gifSearchBtn);

        // GIF results container
        const gifResults = UI.createElement('div', [
            'grid', 'grid-cols-2', 'gap-2', 'max-h-[300px]',
            'overflow-y-auto', 'overflow-x-hidden'
        ]);

        // Loading indicator for GIFs
        const gifLoading = UI.createElement('div', [
            'text-center', 'py-4', 'text-gray-400', 'hidden'
        ]);
        gifLoading.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i>';

        gifPicker.appendChild(gifSearchContainer);
        gifPicker.appendChild(gifLoading);
        gifPicker.appendChild(gifResults);

        // GIF search functionality
        let gifSearchTimeout;
        const searchGifs = async (query) => {
            gifLoading.classList.remove('hidden');
            gifResults.innerHTML = '';

            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(query)}&limit=20&rating=pg-13`);
                const data = await response.json();

                gifResults.innerHTML = '';
                data.data.forEach(gif => {
                    const gifBtn = UI.createElement('button', [
                        'w-full', 'aspect-video', 'rounded', 'overflow-hidden',
                        'hover:opacity-80', 'transition-opacity'
                    ]);
                    const gifImg = UI.createElement('img', [
                        'w-full', 'h-full', 'object-cover'
                    ], {
                        src: gif.images.fixed_height_small.url,
                        alt: gif.title
                    });
                    gifBtn.appendChild(gifImg);
                    gifBtn.addEventListener('click', () => {
                        Game.sendMessage(`[gif:${gif.images.fixed_height.url}]`);
                        gifPicker.classList.add('hidden');
                    });
                    gifResults.appendChild(gifBtn);
                });
            } catch (error) {
                console.error('Error searching GIFs:', error);
                gifResults.innerHTML = '<div class="text-red-500 text-center p-2">Error loading GIFs</div>';
            }

            gifLoading.classList.add('hidden');
        };

        // Handle GIF search input
        gifSearchInput.addEventListener('input', (e) => {
            clearTimeout(gifSearchTimeout);
            if (e.target.value.trim()) {
                gifSearchTimeout = setTimeout(() => searchGifs(e.target.value), 500);
            }
        });

        gifSearchBtn.addEventListener('click', () => {
            if (gifSearchInput.value.trim()) {
                searchGifs(gifSearchInput.value);
            }
        });

        // Add event listeners for emoji and GIF buttons
        emojiBtn.addEventListener('click', () => {
            gifPicker.classList.add('hidden');
            emojiPicker.classList.toggle('hidden');
        });

        gifBtn.addEventListener('click', () => {
            emojiPicker.classList.add('hidden');
            gifPicker.classList.toggle('hidden');
            if (!gifPicker.classList.contains('hidden')) {
                // Load trending GIFs when opened
                searchGifs('trending');
                gifSearchInput.focus();
            }
        });

        // Handle media upload
        mediaBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Check file type and size
            if (!file.type.startsWith('image/')) {
                UI.showNotification('Only image files are supported', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                UI.showNotification('File size must be less than 5MB', 'error');
                return;
            }

            try {
                // Convert image to base64
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const base64 = e.target.result;
                    await Game.sendMessage(`[image:${base64}]`);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
                UI.showNotification('Failed to upload image', 'error');
            }

            // Clear the input
            fileInput.value = '';
        });

        // Add elements to form
        chatForm.appendChild(mediaBtn);
        chatForm.appendChild(fileInput);
        chatForm.appendChild(emojiBtn);
        chatForm.appendChild(gifBtn);
        chatForm.appendChild(chatInput);
        chatForm.appendChild(sendBtn);
        chatForm.appendChild(emojiPicker);
        chatForm.appendChild(gifPicker);
        chatInputArea.appendChild(chatForm);

        // Handle chat form submission
        chatForm.addEventListener('submit', event => {
            event.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                Game.sendMessage(message);
                chatInput.value = '';
            }
        });
        
        // Add chat elements to chat area
        chatArea.appendChild(chatHeader);
        chatArea.appendChild(chatMessages);
        chatArea.appendChild(chatInputArea);
        
        // Menu (hidden by default)
        const menu = UI.createElement('div', [
            'fixed', 'inset-0', 'bg-black', 'bg-opacity-75', 'z-50',
            'flex', 'justify-end', 'hidden'
        ]);
        menu.id = 'menu';
        
        const menuContent = UI.createElement('div', [
            'bg-gray-800', 'w-64', 'h-full', 'p-4', 'animate-slide-in'
        ]);
        
        const menuHeader = UI.createElement('div', [
            'flex', 'justify-between', 'items-center', 'mb-6'
        ]);
        const menuTitle = UI.createElement('h3', ['font-bold', 'text-xl']);
        menuTitle.textContent = 'Menu';
        
        const closeMenuBtn = UI.createElement('button', [
            'text-gray-400', 'hover:text-white'
        ]);
        closeMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeMenuBtn.addEventListener('click', () => Game.toggleMenu());
        
        menuHeader.appendChild(menuTitle);
        menuHeader.appendChild(closeMenuBtn);
        
        // Menu items
        const menuItems = UI.createElement('div', ['space-y-4']);
        
        // Host-only controls (will be conditionally shown)
        const hostControls = UI.createElement('div', ['space-y-2']);
        hostControls.id = 'host-controls';
        
        const hostTitle = UI.createElement('h4', ['text-gray-400', 'text-sm', 'uppercase']);
        hostTitle.textContent = 'Host Controls';
        
        const startGameBtn = UI.createElement('button', [
            'flex', 'items-center', 'space-x-2', 'text-gray-300', 'hover:text-white',
            'w-full', 'py-2'
        ]);
        startGameBtn.innerHTML = '<i class="fas fa-play mr-2"></i> Start Game';
        startGameBtn.addEventListener('click', () => {
            Game.startGame();
            Game.toggleMenu();
        });
        
        const endGameBtn = UI.createElement('button', [
            'flex', 'items-center', 'space-x-2', 'text-gray-300', 'hover:text-white',
            'w-full', 'py-2'
        ]);
        endGameBtn.innerHTML = '<i class="fas fa-stop mr-2"></i> End Game';
        endGameBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end the game?')) {
                Game.endGame();
                Game.toggleMenu();
            }
        });
        
        hostControls.appendChild(hostTitle);
        hostControls.appendChild(startGameBtn);
        hostControls.appendChild(endGameBtn);
        
        // General controls
        const leaveBtn = UI.createElement('button', [
            'flex', 'items-center', 'space-x-2', 'text-gray-300', 'hover:text-white',
            'w-full', 'py-2'
        ]);
        leaveBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i> Leave Game';
        leaveBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to leave the game?')) {
                Game.leaveGame();
            }
        });
        
        // Add menu items
        menuItems.appendChild(hostControls);
        menuItems.appendChild(UI.createElement('hr', ['border-gray-700', 'my-4']));
        menuItems.appendChild(leaveBtn);
        
        menuContent.appendChild(menuHeader);
        menuContent.appendChild(menuItems);
        menu.appendChild(menuContent);
        
        // Add all sections to main container
        main.appendChild(gameArea);
        main.appendChild(chatArea);
        
        container.appendChild(header);
        container.appendChild(main);
        container.appendChild(menu);
        
        // Create responsive layout
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleMediaChange = (e) => {
            if (e.matches) {
                // Desktop layout
                main.classList.remove('flex-col');
                main.classList.add('flex-row');
                chatArea.classList.remove('h-12', 'h-64', 'border-t');
                chatArea.classList.add('border-l', 'h-auto');
                chatMessages.classList.remove('hidden');
                chatInputArea.classList.remove('hidden');
                chatToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                // Mobile layout
                main.classList.remove('flex-row');
                main.classList.add('flex-col');
                chatArea.classList.remove('border-l');
                chatArea.classList.add('border-t', 'h-64');
            }
        };
        
        // Initial check
        handleMediaChange(mediaQuery);
        // Add listener for window resize
        mediaQuery.addEventListener('change', handleMediaChange);
        
        // Initialize game room
        setTimeout(async () => {
            try {
                await Game.initGameRoom();
            } catch (error) {
                console.error('Error initializing game room:', error);
                UI.showNotification('Failed to initialize game room. Please try again.', 'error');
                Game.navigateTo('home');
            }
        }, 100);
        
        return container;
    }
};

// Game Logic
const Game = {
    // Current user/player data
    player: null,
    
    // Current room data
    room: null,
    
    // Game update interval
    updateInterval: null,
    
    // Menu open state
    menuOpen: false,
    
    // Initialize the game
    async init() {
        UI.showLoading();
        
        try {
            // Initialize the database
            await Database.init();
            
            // Check if user is in a room (using sessionStorage instead of localStorage)
            const roomId = sessionStorage.getItem('currentRoomId');
            const playerId = sessionStorage.getItem('currentPlayerId');
            
            if (roomId && playerId) {
                // Try to rejoin the room
                const room = Database.getBy('rooms', 'room_id', roomId)[0];
                const player = Database.getById('players', playerId);
                
                if (room && player) {
                    this.room = room;
                    this.player = player;
                    this.navigateTo('gameRoom');
                    return;
                } else {
                    // Clear invalid storage
                    sessionStorage.removeItem('currentRoomId');
                    sessionStorage.removeItem('currentPlayerId');
                }
            }
            
            // Show homepage
            this.navigateTo('home');
        } catch (error) {
            console.error('Error initializing game:', error);
            UI.showNotification('Error loading game data. Please try again.', 'error');
            this.navigateTo('home');
        }
    },
    
    // Navigate to a specific page
    navigateTo(page) {
        switch (page) {
            case 'home':
                UI.render(Components.homepage());
                break;
            case 'createRoom':
                UI.render(Components.createRoom());
                break;
            case 'joinRoom':
                UI.render(Components.joinRoom());
                break;
            case 'gameRoom':
                UI.render(Components.gameRoom());
                break;
            default:
                this.navigateTo('home');
        }
    },
    
    // Show game instructions
    showInstructions() {
        // Create modal for instructions
        const modal = UI.createElement('div', [
            'fixed', 'inset-0', 'flex', 'items-center', 'justify-center',
            'bg-black', 'bg-opacity-75', 'z-50', 'p-4'
        ]);
        
        const content = UI.createElement('div', [
            'bg-gray-800', 'rounded-xl', 'p-6', 'max-w-md', 'w-full',
            'max-h-[80vh]', 'overflow-y-auto', 'animate-fade-in'
        ]);
        
        const title = UI.createElement('h2', [
            'text-2xl', 'font-bold', 'mb-4', 'text-purple-500'
        ]);
        title.textContent = 'How to Play DareMate';
        
        const instructions = UI.createElement('div', ['space-y-4', 'text-gray-300']);
        instructions.innerHTML = `
            <p><strong>1. Create or Join a Room</strong><br>
            Create a new game room and share the code with friends, or join an existing room with a code.</p>
            
            <p><strong>2. Choose Categories</strong><br>
            Select from Funny, Romantic, Strip, 18+, and Emotional questions.</p>
            
            <p><strong>3. Take Turns</strong><br>
            Players take turns choosing "Truth" or "Dare" and completing the challenges.</p>
            
            <p><strong>4. Chat and Share</strong><br>
            Use the chat to communicate and share media with other players.</p>
            
            <p><strong>5. Have Fun!</strong><br>
            Remember to respect boundaries and keep it fun for everyone.</p>
        `;
        
        const closeBtn = UI.createElement('button', [
            'mt-6', 'bg-purple-600', 'hover:bg-purple-700', 'text-white',
            'py-2', 'px-4', 'rounded-full', 'font-bold', 'btn-hover',
            'w-full'
        ]);
        closeBtn.textContent = 'Got It!';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        content.appendChild(title);
        content.appendChild(instructions);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        
        document.body.appendChild(modal);
    },
    
    // Create a new game room
    async createRoom({ nickname, roomType, categories }) {
        UI.showLoading();
        
        try {
            // Generate unique room ID
            const roomId = Database.generateRoomId();
            
            // Create room in database
            const room = await Database.add('rooms', {
                room_id: roomId,
                host_nickname: nickname,
                type: roomType,
                categories: categories,
                created_at: new Date().toISOString(),
                active: true
            });
            
            // Create player in database
            const player = await Database.add('players', {
                room_id: roomId,
                nickname: nickname,
                is_host: true,
                joined_at: new Date().toISOString(),
                active: true
            });
            
            // Set current player and room
            this.player = player;
            this.room = room;
            
            // Save to sessionStorage for rejoining
            sessionStorage.setItem('currentRoomId', roomId);
            sessionStorage.setItem('currentPlayerId', player.id);
            
            // Show success notification
            UI.showNotification(`Room created! Your room code is: ${roomId}`);
            
            // Navigate to game room
            setTimeout(() => {
                this.navigateTo('gameRoom');
            }, 1000);
        } catch (error) {
            console.error('Error creating room:', error);
            UI.showNotification('Error creating room. Please try again.', 'error');
            this.navigateTo('home');
        }
    },
    
    // Join an existing room
    async joinRoom({ nickname, roomId }) {
        UI.showLoading();
        
        try {
            // Clean up and uppercase room ID
            const cleanRoomId = roomId.trim().toUpperCase();
            
            console.log('Attempting to join room with ID:', cleanRoomId);
            
            // Use the new checkRoom method for better error handling
            const roomCheck = await Database.checkRoom(cleanRoomId);
            console.log('Room check result:', roomCheck);
            
            // First check if room exists
            if (!roomCheck.exists) {
                console.error(`Room not found: ${cleanRoomId}`);
                UI.showNotification('Room not found. Check the code and try again.', 'error');
                this.navigateTo('joinRoom');
                return;
            }
            
            // Then check if room is active
            if (!roomCheck.active) {
                console.error(`Room is inactive: ${cleanRoomId}`);
                UI.showNotification('This room is no longer active.', 'error');
                this.navigateTo('joinRoom');
                return;
            }
            
            const room = roomCheck.room;
            
            // Check if nickname is already taken in this room
            const existingPlayers = Database.getBy('players', 'room_id', cleanRoomId);
            console.log(`Found ${existingPlayers.length} existing players in room ${cleanRoomId}`);
            
            const nicknameExists = existingPlayers.some(
                player => player.nickname.toLowerCase() === nickname.toLowerCase() && player.active
            );
            
            if (nicknameExists) {
                console.error(`Nickname already taken: ${nickname}`);
                UI.showNotification('Nickname already taken in this room. Please choose another.', 'error');
                this.navigateTo('joinRoom');
                return;
            }
            
            console.log('Creating new player in room:', cleanRoomId);
            
            // Create player in database
            const player = await Database.add('players', {
                room_id: cleanRoomId,
                nickname: nickname,
                is_host: false,
                joined_at: new Date().toISOString(),
                active: true
            });
            
            console.log('Player created:', player);
            
            // Set current player and room
            this.player = player;
            this.room = room;
            
            // Save to sessionStorage for rejoining
            sessionStorage.setItem('currentRoomId', cleanRoomId);
            sessionStorage.setItem('currentPlayerId', player.id);
            
            console.log('Adding system message for player join');
            
            // Add system message about player joining
            await Database.add('messages', {
                room_id: cleanRoomId,
                system: true,
                message: `${nickname} has joined the room.`,
                created_at: new Date().toISOString()
            });
            
            // Show success notification
            UI.showNotification(`Successfully joined room ${cleanRoomId}!`);
            
            console.log('Navigating to game room');
            
            // Navigate to game room
            setTimeout(() => {
                this.navigateTo('gameRoom');
            }, 1000);
        } catch (error) {
            console.error('Error joining room:', error);
            UI.showNotification('Error joining room. Please try again.', 'error');
            this.navigateTo('joinRoom');
        }
    },
    
    // Initialize game room
    async initGameRoom() {
        console.log('Initializing game room...');
        
        if (!this.room || !this.room.room_id) {
            console.error('Cannot initialize game room: Room data is missing', this.room);
            UI.showNotification('Error loading game room. Missing room data.', 'error');
            this.navigateTo('home');
            return;
        }
        
        if (!this.player || !this.player.id) {
            console.error('Cannot initialize game room: Player data is missing', this.player);
            UI.showNotification('Error loading game room. Missing player data.', 'error');
            this.navigateTo('home');
            return;
        }
        
        console.log(`Room ID: ${this.room.room_id}, Player: ${this.player.nickname} (ID: ${this.player.id})`);
        
        try {
            // Re-fetch room and player data to ensure it's up-to-date
            await Database.loadCollection('rooms');
            await Database.loadCollection('players');
            
            // Verify room exists and is active
            const roomCheck = await Database.checkRoom(this.room.room_id);
            if (!roomCheck.exists || !roomCheck.active) {
                console.error('Room no longer exists or is inactive', roomCheck);
                UI.showNotification('This room is no longer available', 'error');
                this.navigateTo('home');
                return;
            }
            
            // Update room data
            this.room = roomCheck.room;
            console.log('Updated room data:', this.room);
            
            // Verify player exists and is active
            const player = Database.getById('players', this.player.id);
            if (!player || !player.active) {
                console.error('Player no longer exists or is inactive', player);
                UI.showNotification('Your player data is no longer valid', 'error');
                this.navigateTo('home');
                return;
            }
            
            // Update player data
            this.player = player;
            console.log('Updated player data:', this.player);
            
            // Show/hide host controls
            const hostControls = document.getElementById('host-controls');
            if (hostControls) {
                hostControls.style.display = this.player.is_host ? 'block' : 'none';
            }
            
            // Set up players list
            await this.updatePlayersList();
            
            // Set up chat messages
            await this.updateChatMessages();
            
            // Check game state and update UI
            await this.updateGameState();
            
            // Set up polling for updates
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.updateInterval = setInterval(async () => {
                await this.updatePlayersList();
                await this.updateChatMessages();
                await this.updateGameState();
            }, 2000);
            
            console.log('Game room initialized successfully');
        } catch (error) {
            console.error('Error initializing game room:', error);
            UI.showNotification('Failed to initialize game room. Please try again.', 'error');
            this.navigateTo('home');
        }
        
        // Initialize chat input with typing detection
        this.initChatInput();
        
        // Start periodic checks for typing status
        this.typingCheckInterval = setInterval(() => {
            this.checkTypingStatus();
        }, 1000);
    },
    
    // Clean up when leaving game room
    cleanupGameRoom() {
        // Clear update interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Clear typing check interval
        if (this.typingCheckInterval) {
            clearInterval(this.typingCheckInterval);
            this.typingCheckInterval = null;
        }
        
        // Clear typing status
        this.updateTypingStatus(false);
    },
    
    // Toggle the menu
    toggleMenu() {
        const menu = document.getElementById('menu');
        if (menu) {
            this.menuOpen = !this.menuOpen;
            if (this.menuOpen) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        }
    },
    
    // Update players list
    async updatePlayersList() {
        const playersList = document.getElementById('players-list');
        if (!playersList) {
            console.error('Players list element not found in the DOM');
            return;
        }
        
        if (!this.room || !this.room.room_id) {
            console.error('Room data missing or invalid', this.room);
            return;
        }
        
        console.log(`Updating players list for room: ${this.room.room_id}`);
        
        try {
            // Reload players data from server to ensure it's up-to-date
            await Database.loadCollection('players');
            
            // Get all active players in the room with detailed logging
            console.log(`Fetching players for room_id: ${this.room.room_id}`);
            const allPlayers = Database.getAll('players');
            console.log(`Total players in database: ${allPlayers.length}`);
            
            // Filter players by room_id manually to ensure case-insensitive matching
            let players = allPlayers.filter(player => {
                const playerRoomId = (player.room_id || '').trim().toUpperCase();
                const currentRoomId = this.room.room_id.trim().toUpperCase();
                const isInRoom = playerRoomId === currentRoomId;
                const isActive = player.active === true;
                console.log(`Player ${player.nickname}: room=${playerRoomId}, current=${currentRoomId}, match=${isInRoom}, active=${isActive}`);
                return isInRoom && isActive;
            });
            
            console.log(`Found ${players.length} active players in room ${this.room.room_id}`);
            players.forEach(p => console.log(`- ${p.nickname} (${p.is_host ? 'Host' : 'Player'})`));
            
            // Clear current list
            playersList.innerHTML = '';
            
            if (players.length === 0) {
                console.warn('No active players found in this room');
                const noPlayersMessage = UI.createElement('div', [
                    'text-gray-400', 'p-3', 'text-center', 'w-full'
                ]);
                noPlayersMessage.textContent = 'Waiting for players...';
                playersList.appendChild(noPlayersMessage);
                return;
            }
            
            // Add each player to the list
            players.forEach(player => {
                const playerItem = UI.createElement('div', [
                    'bg-gray-800', 'p-3', 'rounded-lg', 'flex', 'items-center',
                    'justify-between', 'mb-2'
                ]);
                
                const playerInfo = UI.createElement('div', ['flex', 'items-center']);
                
                const playerIcon = UI.createElement('div', [
                    'w-8', 'h-8', 'rounded-full', 'bg-purple-700', 'flex',
                    'items-center', 'justify-center', 'mr-2',
                    player.id === this.player.id ? 'border-2' : '',
                    player.id === this.player.id ? 'border-white' : ''
                ]);
                playerIcon.textContent = player.nickname.charAt(0).toUpperCase();
                
                const playerName = UI.createElement('div', ['text-sm']);
                playerName.textContent = player.nickname;
                
                // Highlight the current player
                if (player.id === this.player.id) {
                    playerName.classList.add('font-bold', 'text-purple-300');
                }
                
                playerInfo.appendChild(playerIcon);
                playerInfo.appendChild(playerName);
                
                const playerStatus = UI.createElement('div', ['text-xs']);
                
                // Show host badge if player is host
                if (player.is_host) {
                    const hostBadge = UI.createElement('span', [
                        'bg-purple-900', 'text-purple-100', 'px-2', 'py-1',
                        'rounded', 'text-xs'
                    ]);
                    hostBadge.textContent = 'Host';
                    playerStatus.appendChild(hostBadge);
                }
                
                playerItem.appendChild(playerInfo);
                playerItem.appendChild(playerStatus);
                
                playersList.appendChild(playerItem);
            });
            
            // Update player count in game status
            const gameStatus = document.getElementById('game-status');
            if (gameStatus) {
                const playerCountEl = gameStatus.querySelector('.text-gray-400');
                if (playerCountEl) {
                    playerCountEl.textContent = `${players.length} player(s) in the room`;
                }
            }
        } catch (error) {
            console.error('Error updating players list:', error);
            // Don't show error message in the UI, just log it
            return;
        }
    },
    
    // Update chat messages
    async updateChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        try {
            // Reload messages data from server to ensure it's up-to-date
            await Database.loadCollection('messages');
            
            // Get all messages for this room
            const messages = Database.getBy('messages', 'room_id', this.room.room_id)
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            
            // Check if chat should be scrolled to bottom
            // (if already at the bottom or this is the first load)
            const shouldScrollToBottom = 
                chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 10 || 
                chatMessages.children.length === 0;
            
            // Get current number of messages displayed
            const currentCount = chatMessages.children.length;
            
            // If no new messages, return
            if (messages.length <= currentCount) return;
            
            // Add only new messages
            for (let i = currentCount; i < messages.length; i++) {
                const message = messages[i];
                
                // Create message element
                const messageEl = this.createChatMessage(message);
                
                // Add to chat
                chatMessages.appendChild(messageEl);
            }
            
            // Scroll to bottom only if we were already at the bottom
            if (shouldScrollToBottom) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } catch (error) {
            console.error('Error updating chat messages:', error);
        }
    },
    
    // Create a chat message element
    createChatMessage(message) {
        if (message.system) {
            // System message
            const systemMessage = UI.createElement('div', [
                'text-center', 'text-gray-500', 'text-sm', 'py-1'
            ]);
            systemMessage.textContent = message.message;
            
            // Add timestamp to system message
            if (message.created_at) {
                const timestamp = UI.createElement('span', [
                    'text-xs', 'opacity-50', 'ml-2'
                ]);
                const time = new Date(message.created_at);
                timestamp.textContent = time.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
                systemMessage.appendChild(timestamp);
            }
            
            return systemMessage;
        } else {
            // User message
            const isMine = message.nickname === this.player.nickname;
            
            const messageEl = UI.createElement('div', [
                'chat-message',
                isMine ? 'message-mine' : 'message-others',
                'p-3'
            ]);
            
            // Create message container with flex layout
            const messageContainer = UI.createElement('div', ['message-container']);
            
            // Message content
            const messageContent = UI.createElement('div', ['message-content']);
            
            // Check for special message types
            if (message.message.startsWith('[gif:')) {
                // GIF message
                const url = message.message.slice(5, -1);
                const img = UI.createElement('img', [
                    'max-w-full', 'rounded-lg', 'cursor-pointer'
                ], {
                    src: url,
                    alt: 'GIF'
                });
                
                // Add click handler to view full size
                img.addEventListener('click', () => {
                    const modal = UI.createElement('div', [
                        'fixed', 'inset-0', 'bg-black', 'bg-opacity-75',
                        'flex', 'items-center', 'justify-center', 'z-50',
                        'p-4'
                    ]);
                    const modalImg = UI.createElement('img', [
                        'max-w-full', 'max-h-full', 'object-contain'
                    ], {
                        src: url,
                        alt: 'Full size GIF'
                    });
                    modal.appendChild(modalImg);
                    modal.addEventListener('click', () => {
                        document.body.removeChild(modal);
                    });
                    document.body.appendChild(modal);
                });
                
                messageContent.appendChild(img);
            } else if (message.message.startsWith('[image:')) {
                // Image message
                const base64 = message.message.slice(7, -1);
                const img = UI.createElement('img', [
                    'max-w-full', 'rounded-lg', 'cursor-pointer'
                ], {
                    src: base64,
                    alt: 'Shared image'
                });
                
                // Add click handler to view full size
                img.addEventListener('click', () => {
                    const modal = UI.createElement('div', [
                        'fixed', 'inset-0', 'bg-black', 'bg-opacity-75',
                        'flex', 'items-center', 'justify-center', 'z-50',
                        'p-4'
                    ]);
                    const modalImg = UI.createElement('img', [
                        'max-w-full', 'max-h-full', 'object-contain'
                    ], {
                        src: base64,
                        alt: 'Full size image'
                    });
                    modal.appendChild(modalImg);
                    modal.addEventListener('click', () => {
                        document.body.removeChild(modal);
                    });
                    document.body.appendChild(modal);
                });
                
                messageContent.appendChild(img);
            } else {
                // Regular text message
                messageContent.textContent = message.message;
            }
            
            messageContainer.appendChild(messageContent);
            
            // Add timestamp
            if (message.created_at) {
                const timestamp = UI.createElement('div', ['message-timestamp']);
                const time = new Date(message.created_at);
                timestamp.textContent = time.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
                messageContainer.appendChild(timestamp);
            }
            
            messageEl.appendChild(messageContainer);
            return messageEl;
        }
    },
    
    // Create typing indicator element
    createTypingIndicator() {
        const indicator = UI.createElement('div', ['typing-indicator']);
        const text = UI.createElement('span');
        text.textContent = 'Someone is typing';
        
        const dots = UI.createElement('div', ['typing-dots']);
        for (let i = 0; i < 3; i++) {
            dots.appendChild(UI.createElement('div', ['typing-dot']));
        }
        
        indicator.appendChild(text);
        indicator.appendChild(dots);
        return indicator;
    },
    
    // Update typing status
    async updateTypingStatus(isTyping) {
        if (!this.player || !this.room) return;
        
        await Database.update('players', this.player.id, {
            is_typing: isTyping,
            last_typed: isTyping ? new Date().toISOString() : null
        });
    },
    
    // Check and update typing indicators
    async checkTypingStatus() {
        if (!this.player || !this.room) return;
        
        const players = Database.getBy('players', 'room_id', this.room.room_id)
            .filter(p => p.active && p.id !== this.player.id);
        
        const typingPlayers = players.filter(p => {
            if (!p.is_typing || !p.last_typed) return false;
            
            // Consider typing status expired after 3 seconds
            const lastTyped = new Date(p.last_typed);
            const now = new Date();
            return (now - lastTyped) < 3000;
        });
        
        // Update typing indicator
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        let indicator = chatMessages.querySelector('.typing-indicator');
        
        if (typingPlayers.length > 0) {
            if (!indicator) {
                indicator = this.createTypingIndicator();
                chatMessages.appendChild(indicator);
            }
            
            // Update text based on who's typing
            const text = indicator.querySelector('span');
            if (typingPlayers.length === 1) {
                text.textContent = `${typingPlayers[0].nickname} is typing`;
            } else if (typingPlayers.length === 2) {
                text.textContent = `${typingPlayers[0].nickname} and ${typingPlayers[1].nickname} are typing`;
            } else {
                text.textContent = 'Several people are typing';
            }
            
            // Show the indicator
            indicator.classList.add('visible');
        } else if (indicator) {
            // Hide the indicator
            indicator.classList.remove('visible');
        }
    },
    
    // Initialize chat input with typing detection
    initChatInput() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        
        let typingTimeout;
        
        input.addEventListener('input', () => {
            // Clear existing timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            // Set typing status to true
            this.updateTypingStatus(true);
            
            // Set timeout to clear typing status
            typingTimeout = setTimeout(() => {
                this.updateTypingStatus(false);
            }, 2000);
        });
        
        input.addEventListener('blur', () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            this.updateTypingStatus(false);
        });
    },
    
    // Send a chat message
    async sendMessage(message) {
        // Add message to database
        await Database.add('messages', {
            room_id: this.room.room_id,
            nickname: this.player.nickname,
            message: message,
            created_at: new Date().toISOString()
        });
        
        // Update chat messages
        this.updateChatMessages();
    },
    
    // Update the game state
    async updateGameState() {
        const gameStatus = document.getElementById('game-status');
        const truthDareBtns = document.getElementById('truth-dare-btns');
        const questionDisplay = document.getElementById('question-display');
        
        if (!gameStatus || !truthDareBtns || !questionDisplay) return;

        try {
            // Reload turns data from server to ensure it's up-to-date
            await Database.loadCollection('turns');
            
            // Get current game state
            const turns = Database.getBy('turns', 'room_id', this.room.room_id)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Get active players
            const activePlayers = Database.getBy('players', 'room_id', this.room.room_id)
                .filter(player => player.active);
            
            if (turns.length === 0) {
                // Game hasn't started
                if (this.player.is_host) {
                    gameStatus.innerHTML = `
                        <h3 class="text-2xl font-bold mb-2">Waiting to Start</h3>
                        <p class="text-gray-400 mb-4">${activePlayers.length} player(s) in the room</p>
                        <button id="start-game-btn" class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full font-bold shadow-lg btn-hover">
                            <i class="fas fa-play mr-2"></i> Start Game
                        </button>
                    `;
                    document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
                } else {
                    gameStatus.innerHTML = `
                        <h3 class="text-2xl font-bold mb-2">Waiting for Host</h3>
                        <p class="text-gray-400">${activePlayers.length} player(s) in the room</p>
                    `;
                }
                
                // Hide truth/dare buttons and question
                truthDareBtns.classList.add('hidden');
                questionDisplay.classList.add('hidden');
                return;
            }
            
            // Game is in progress
            const currentTurn = turns[0];
            
            // Check if it's this player's turn
            const isMyTurn = currentTurn.current_player === this.player.id;
            const currentPlayerData = activePlayers.find(p => p.id === currentTurn.current_player);
            const currentPlayerName = currentPlayerData ? currentPlayerData.nickname : 'Unknown';
            
            if (!currentTurn.type) {
                // Player needs to choose Truth or Dare
                gameStatus.innerHTML = isMyTurn
                    ? `<h3 class="text-2xl font-bold mb-2">It's Your Turn!</h3>
                       <p class="text-gray-400">Choose Truth or Dare</p>`
                    : `<h3 class="text-2xl font-bold mb-2">${currentPlayerName}'s Turn</h3>
                       <p class="text-gray-400">Waiting for them to choose Truth or Dare</p>`;
                       
                // Show Truth/Dare buttons only if it's player's turn
                truthDareBtns.classList.toggle('hidden', !isMyTurn);
                questionDisplay.classList.add('hidden');
            } else {
                // A question has been assigned
                gameStatus.innerHTML = isMyTurn
                    ? `<h3 class="text-2xl font-bold mb-2">Your Turn</h3>
                       <p class="text-gray-400">You chose: ${currentTurn.type.toUpperCase()}</p>`
                    : `<h3 class="text-2xl font-bold mb-2">${currentPlayerName}'s Turn</h3>
                       <p class="text-gray-400">They chose: ${currentTurn.type.toUpperCase()}</p>`;
                       
                // Hide Truth/Dare buttons
                truthDareBtns.classList.add('hidden');
                
                // Show question
                questionDisplay.classList.remove('hidden');
                questionDisplay.innerHTML = `
                    <h4 class="text-xl font-bold mb-3 text-purple-400">${currentTurn.type.toUpperCase()}</h4>
                    <p class="text-xl">${currentTurn.question}</p>
                    ${isMyTurn ? `
                    <div class="mt-6 flex justify-center space-x-4">
                        <button id="change-question-btn" class="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-full font-bold shadow-lg btn-hover">
                            <i class="fas fa-sync-alt mr-2"></i> Change Question
                        </button>
                        <button id="complete-turn-btn" class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full font-bold shadow-lg btn-hover">
                            <i class="fas fa-check mr-2"></i> Complete
                        </button>
                    </div>
                    ` : ''}
                `;
                
                // Add event listeners for buttons
                const completeBtn = document.getElementById('complete-turn-btn');
                const changeQuestionBtn = document.getElementById('change-question-btn');
                
                if (completeBtn) {
                    completeBtn.addEventListener('click', () => this.completeTurn());
                }
                
                if (changeQuestionBtn) {
                    changeQuestionBtn.addEventListener('click', () => this.changeQuestion(currentTurn));
                }
            }
        } catch (error) {
            console.error('Error updating game state:', error);
        }
    },
    
    // Change the current question
    async changeQuestion(currentTurn) {
        try {
            // Get a new random question of the same type
            const question = Database.getRandomQuestion(this.room.categories, currentTurn.type);
            
            if (!question) {
                UI.showNotification('No more questions available for this type', 'error');
                return;
            }
            
            // Update the turn with the new question
            await Database.update('turns', currentTurn.id, {
                question: question.text
            });
            
            // Add system message
            await Database.add('messages', {
                room_id: this.room.room_id,
                system: true,
                message: `${this.player.nickname} changed their question.`,
                created_at: new Date().toISOString()
            });
            
            // Update game state
            this.updateGameState();
            
            // Show success notification
            UI.showNotification('Question changed successfully!');
        } catch (error) {
            console.error('Error changing question:', error);
            UI.showNotification('Failed to change question. Please try again.', 'error');
        }
    },
    
    // Start the game
    async startGame() {
        if (!this.player.is_host) return;
        
        // Get active players
        const players = Database.getBy('players', 'room_id', this.room.room_id)
            .filter(player => player.active);
        
        if (players.length < 2) {
            UI.showNotification('Need at least 2 players to start the game', 'error');
            return;
        }
        
        // Choose a random player to go first
        const randomIndex = Math.floor(Math.random() * players.length);
        const firstPlayer = players[randomIndex];
        
        // Create the first turn
        await Database.add('turns', {
            room_id: this.room.room_id,
            current_player: firstPlayer.id,
            timestamp: new Date().toISOString()
        });
        
        // Add system message
        await Database.add('messages', {
            room_id: this.room.room_id,
            system: true,
            message: `Game started! ${firstPlayer.nickname} goes first.`,
            created_at: new Date().toISOString()
        });
        
        // Update game state
        this.updateGameState();
    },
    
    // Select Truth or Dare
    async selectChoice(type) {
        // Get the current turn
        const turns = Database.getBy('turns', 'room_id', this.room.room_id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (turns.length === 0) return;
        
        const currentTurn = turns[0];
        
        // Verify it's the player's turn
        if (currentTurn.current_player !== this.player.id) return;
        
        // Get a random question of the selected type
        const question = Database.getRandomQuestion(this.room.categories, type);
        
        if (!question) {
            UI.showNotification('No questions available for this type', 'error');
            return;
        }
        
        // Update the turn with the chosen type and question
        await Database.update('turns', currentTurn.id, {
            type: type,
            question: question.text
        });
        
        // Add system message
        await Database.add('messages', {
            room_id: this.room.room_id,
            system: true,
            message: `${this.player.nickname} chose ${type.toUpperCase()}.`,
            created_at: new Date().toISOString()
        });
        
        // Update game state
        this.updateGameState();
    },
    
    // Complete the current turn
    async completeTurn() {
        // Get the current turn
        const turns = Database.getBy('turns', 'room_id', this.room.room_id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (turns.length === 0) return;
        
        const currentTurn = turns[0];
        
        // Verify it's the player's turn
        if (currentTurn.current_player !== this.player.id) return;
        
        // Mark current turn as completed
        await Database.update('turns', currentTurn.id, {
            completed: true,
            completed_at: new Date().toISOString()
        });
        
        // Get all active players for next turn
        const activePlayers = Database.getBy('players', 'room_id', this.room.room_id)
            .filter(player => player.active);
        
        if (activePlayers.length < 2) {
            UI.showNotification('Not enough players to continue', 'error');
            return;
        }
        
        // Find the index of the current player
        const currentPlayerIndex = activePlayers.findIndex(p => p.id === currentTurn.current_player);
        
        // Select next player (circular)
        const nextPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
        const nextPlayer = activePlayers[nextPlayerIndex];
        
        // Create new turn
        await Database.add('turns', {
            room_id: this.room.room_id,
            current_player: nextPlayer.id,
            timestamp: new Date().toISOString()
        });
        
        // Add system message
        await Database.add('messages', {
            room_id: this.room.room_id,
            system: true,
            message: `${this.player.nickname} completed their turn. It's now ${nextPlayer.nickname}'s turn.`,
            created_at: new Date().toISOString()
        });
        
        // Update game state
        this.updateGameState();
    },
    
    // End the game (host only)
    async endGame() {
        if (!this.player.is_host) return;
        
        // Update room to inactive
        await Database.update('rooms', this.room.id, {
            active: false
        });
        
        // Add system message
        await Database.add('messages', {
            room_id: this.room.room_id,
            system: true,
            message: `Game ended by the host.`,
            created_at: new Date().toISOString()
        });
        
        // Navigate back to home
        sessionStorage.removeItem('currentRoomId');
        sessionStorage.removeItem('currentPlayerId');
        
        this.cleanupGameRoom();
        this.navigateTo('home');
    },
    
    // Leave the game
    async leaveGame() {
        if (this.player.is_host) {
            // If host leaves, end the game
            this.endGame();
        } else {
            // Mark player as inactive
            await Database.update('players', this.player.id, {
                active: false
            });
            
            // Add system message
            await Database.add('messages', {
                room_id: this.room.room_id,
                system: true,
                message: `${this.player.nickname} has left the game.`,
                created_at: new Date().toISOString()
            });
            
            // Clear sessionStorage
            sessionStorage.removeItem('currentRoomId');
            sessionStorage.removeItem('currentPlayerId');
            
            // Navigate back to home
            this.cleanupGameRoom();
            this.navigateTo('home');
        }
    },
    
    // Refresh game data
    async refreshGameData() {
        try {
            // Show loading indicator
            const playersList = document.getElementById('players-list');
            if (playersList) {
                playersList.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-xl text-purple-500"></i></div>';
            }
            
            // Reload all relevant collections
            await Promise.all([
                Database.loadCollection('rooms'),
                Database.loadCollection('players'),
                Database.loadCollection('messages'),
                Database.loadCollection('turns')
            ]);
            
            // Update all UI components
            await this.updatePlayersList();
            await this.updateChatMessages();
            await this.updateGameState();
            
            // Show success notification
            UI.showNotification('Game data refreshed successfully!');
        } catch (error) {
            console.error('Error refreshing game data:', error);
            UI.showNotification('Failed to refresh game data. Please try again.', 'error');
        }
    }
};

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    Game.init().catch(err => {
        console.error('Error initializing game:', err);
        UI.showNotification('Failed to initialize the game. Please reload the page.', 'error');
    });
}); 