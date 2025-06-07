// Main application logic for Does Cardi Brenda Party in Dallas
document.addEventListener('DOMContentLoaded', function() {
    const isAdmin = window.location.hash === '#admin';

    // Get DOM elements
    const answerDisplay = document.getElementById('answerDisplay');
    const toggleBtn = document.getElementById('toggleBtn');
    const answerText = answerDisplay.querySelector('.answer-text');
    const galleryGrid = document.getElementById('galleryGrid');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const photoInput = document.getElementById('photoInput');

    if (!isAdmin) {
        toggleBtn.style.display = 'none';
        addPhotoBtn.style.display = 'none';
    }

    // Application state
    let currentAnswer = 'No';

    // Initialize the display
    async function initializeDisplay() {
        const response = await fetch('/data');
        if (response.ok) {
            const data = await response.json();
            currentAnswer = data.answer || 'No';
            renderPhotos(data.photos || []);
        } else {
            renderPhotos([]);
        }
        updateAnswerDisplay();
    }
    
    function updateAnswerDisplay() {
        answerDisplay.classList.add('loading');

        setTimeout(() => {
            answerText.textContent = currentAnswer;
            answerDisplay.classList.remove('yes', 'no', 'loading');
            answerDisplay.classList.add(currentAnswer.toLowerCase());
            answerDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                answerDisplay.style.transform = 'scale(1)';
            }, 150);
        }, 300);
    }
    
    // Toggle between Yes and No
    async function toggleAnswer() {
        const resp = await fetch('/toggle', { method: 'POST' });
        if (resp.ok) {
            const data = await resp.json();
            currentAnswer = data.answer;
            updateAnswerDisplay();

            const nextAnswer = currentAnswer === 'Yes' ? 'No' : 'Yes';
            toggleBtn.textContent = `Switch to ${nextAnswer}`;

            toggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    function renderPhotos(photos) {
        galleryGrid.innerHTML = '';
        if (!photos || photos.length === 0) {
            galleryGrid.innerHTML = '<p class="no-records-text">No photos yet. Add one!</p>';
            return;
        }
        photos.forEach(photoSrc => {
            const img = document.createElement('img');
            img.src = photoSrc;
            img.classList.add('gallery-photo');
            galleryGrid.appendChild(img);
        });
    }

    async function refreshPhotos() {
        const resp = await fetch('/data');
        if (resp.ok) {
            const data = await resp.json();
            renderPhotos(data.photos || []);
        } else {
            renderPhotos([]);
        }
    }

    async function addPhoto(event) {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                await fetch('/photos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: e.target.result })
                });
                await refreshPhotos();
            };
            reader.readAsDataURL(file);
        }
    }

    if (isAdmin) {
        addPhotoBtn.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', addPhoto);

        toggleBtn.addEventListener('click', toggleAnswer);

        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space' || event.code === 'Enter') {
                if (document.activeElement === toggleBtn) {
                    event.preventDefault();
                    toggleAnswer();
                }
            }
        });

        toggleBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        toggleBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
    
    initializeDisplay();

    if (isAdmin) {
        toggleBtn.textContent = 'Switch to Yes';
    }
    
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
})

