// Main application logic for Does Cardi Brenda Party in Dallas
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const answerDisplay = document.getElementById('answerDisplay');
    const toggleBtn = document.getElementById('toggleBtn');
    const answerText = answerDisplay.querySelector('.answer-text');
    const galleryGrid = document.getElementById('galleryGrid');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const photoInput = document.getElementById('photoInput');
    
    // Application state
    let currentAnswer = 'No'; // Default state as specified
    
    // Initialize the display
    function initializeDisplay() {
        updateAnswerDisplay();
        loadPhotos();
    }
    
    // Update the answer display based on current state
    function updateAnswerDisplay() {
        // Add loading animation
        answerDisplay.classList.add('loading');
        
        setTimeout(() => {
            // Update text
            answerText.textContent = currentAnswer;
            
            // Update styling classes
            answerDisplay.classList.remove('yes', 'no', 'loading');
            answerDisplay.classList.add(currentAnswer.toLowerCase());
            
            // Add a subtle bounce effect
            answerDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                answerDisplay.style.transform = 'scale(1)';
            }, 150);
        }, 300);
    }
    
    // Toggle between Yes and No
    function toggleAnswer() {
        currentAnswer = currentAnswer === 'Yes' ? 'No' : 'Yes';
        updateAnswerDisplay();
        
        // Update button text based on what the next action will be
        const nextAnswer = currentAnswer === 'Yes' ? 'No' : 'Yes';
        toggleBtn.textContent = `Switch to ${nextAnswer}`;
        
        // Add button press effect
        toggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 100);
        
        // Optional: Log the state change for debugging
        console.log(`Answer changed to: ${currentAnswer}`);
    }
    
    // Photo Gallery Logic
    function loadPhotos() {
        const photos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];
        if (photos.length === 0) {
            galleryGrid.innerHTML = '<p class="no-records-text">No photos yet. Add one!</p>';
        } else {
            photos.forEach(photoSrc => {
                const img = document.createElement('img');
                img.src = photoSrc;
                img.classList.add('gallery-photo');
                galleryGrid.appendChild(img);
            });
        }
    }

    function addPhoto(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const noPhotosMessage = galleryGrid.querySelector('.no-records-text');
            if (noPhotosMessage) {
                noPhotosMessage.remove();
            }
        }
        
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photos = JSON.parse(localStorage.getItem('galleryPhotos')) || [];
                photos.push(e.target.result);
                localStorage.setItem('galleryPhotos', JSON.stringify(photos));

                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('gallery-photo');
                galleryGrid.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    addPhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', addPhoto);
    
    // Add event listener to toggle button
    toggleBtn.addEventListener('click', toggleAnswer);
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(event) {
        // Toggle on spacebar or Enter key
        if (event.code === 'Space' || event.code === 'Enter') {
            if (document.activeElement === toggleBtn) {
                event.preventDefault();
                toggleAnswer();
            }
        }
    });
    
    // Add hover effects for better interactivity
    toggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    toggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    // Initialize the application
    initializeDisplay();
    
    // Set initial button text
    toggleBtn.textContent = 'Switch to Yes';
    
    // Optional: Add some fun random facts about Dallas (can be removed if not needed)
    const dallasFacts = [
        "Dallas is home to the largest arts district in the United States!",
        "The frozen margarita machine was invented in Dallas in 1971!",
        "Dallas has more shopping centers per capita than any other US city!",
        "The Dallas Cowboys are known as 'America's Team'!",
        "Dallas is the birthplace of the integrated circuit!"
    ];
    
    // Function to add a random Dallas fact (for future enhancement)
    function getRandomDallasFact() {
        return dallasFacts[Math.floor(Math.random() * dallasFacts.length)];
    }
    
    // Expose some functions globally for potential future use
    window.CardiBrendaApp = {
        toggleAnswer: toggleAnswer,
        getCurrentAnswer: () => currentAnswer,
        getRandomDallasFact: getRandomDallasFact
    };
});