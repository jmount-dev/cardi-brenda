// Main application logic for Does Cardi Brenda Party in Dallas
document.addEventListener('DOMContentLoaded', function () {
  const isAdmin = window.location.hash === '#admin';

  const galleryGrid = document.getElementById('galleryGrid');
  const addPhotoBtn = document.getElementById('addPhotoBtn');
  const photoInput = document.getElementById('photoInput');
  const lastSeenText = document.getElementById('lastSeenText');

  if (!isAdmin) {
    addPhotoBtn.style.display = 'none';
  }

  async function initializeDisplay() {
    const response = await fetch('/data');
    if (response.ok) {
      const data = await response.json();
      renderPhotos(data.photos || []);
      updateLastSeen(data.photos || []);
    } else {
      renderPhotos([]);
      updateLastSeen([]);
    }
  }

  function formatRelative(date) {
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day > 0) return `${day} day${day > 1 ? 's' : ''} ago`;
    if (hr > 0) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
    if (min > 0) return `${min} minute${min > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  function updateLastSeen(photos) {
    if (!photos || photos.length === 0) {
      lastSeenText.textContent = 'Never';
      return;
    }
    const last = photos[photos.length - 1];
    const date = new Date(last.timestamp);
    lastSeenText.textContent = `Last seen partying ${formatRelative(date)}`;
  }

  function renderPhotos(photos) {
    galleryGrid.innerHTML = '';
    if (!photos || photos.length === 0) {
      galleryGrid.innerHTML = '<p class="no-records-text">No photos yet. Add one!</p>';
      return;
    }
    photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.src;
      img.classList.add('gallery-photo');
      galleryGrid.appendChild(img);
    });
  }

  async function refreshPhotos() {
    const resp = await fetch('/data');
    if (resp.ok) {
      const data = await resp.json();
      renderPhotos(data.photos || []);
      updateLastSeen(data.photos || []);
    } else {
      renderPhotos([]);
      updateLastSeen([]);
    }
  }

  async function addPhoto(event) {
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async function (e) {
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
  }

  initializeDisplay();

  // Optional: Add some fun random facts about Dallas (can be removed if not needed)
  const dallasFacts = [
    'Dallas is home to the largest arts district in the United States!',
    'The frozen margarita machine was invented in Dallas in 1971!',
    'Dallas has more shopping centers per capita than any other US city!',
    "The Dallas Cowboys are known as 'America's Team'!",
    'Dallas is the birthplace of the integrated circuit!'
  ];

  function getRandomDallasFact() {
    return dallasFacts[Math.floor(Math.random() * dallasFacts.length)];
  }

  window.CardiBrendaApp = {
    getRandomDallasFact: getRandomDallasFact
  };
});
