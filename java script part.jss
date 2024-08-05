document.addEventListener('DOMContentLoaded', () => {
    loadBadges();
    const closeButton = document.querySelector('.modal .close');
    closeButton.onclick = () => {
        document.getElementById('congratulations-modal').style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target === document.getElementById('congratulations-modal')) {
            document.getElementById('congratulations-modal').style.display = 'none';
        }
    };
});

let currentChallenge = '';

function completeChallenge(challengeName) {
    currentChallenge = challengeName;
    document.getElementById('photo-upload').style.display = 'block';
    addBadge(challengeName); // Earn a badge immediately
    triggerClap(); // Trigger clap animation
    showCongratulationsModal(); // Show the congratulatory modal
}

function showCongratulationsModal() {
    const modal = document.getElementById('congratulations-modal');
    modal.style.display = 'block';
}

function triggerClap() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.style.animation = 'clap 0.5s ease-in-out';
        badge.addEventListener('animationend', () => {
            badge.style.animation = ''; // Reset animation
        });
    });
}

function addBadge(challengeName) {
    const badgeList = document.getElementById('badge-list');
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.innerText = `Badge: ${challengeName}`;
    badgeList.appendChild(badge);

    // Save badge to local storage
    saveBadge(challengeName, null); // No image yet
}

function submitPhoto() {
    const photoInput = document.getElementById('photo');
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const badges = document.querySelectorAll('.badge');
            badges.forEach(badge => {
                if (badge.innerText.includes(currentChallenge)) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = currentChallenge;
                    img.width = 100;
                    badge.appendChild(img);
                    updateBadgeImage(currentChallenge, e.target.result); // Save image to local storage
                }
            });
            alert(`Photo for challenge "${currentChallenge}" submitted!`);
        };

        reader.readAsDataURL(file);

        document.getElementById('photo-upload').style.display = 'none';
        photoInput.value = ''; // Clear the file input
    } else {
        alert('Please upload a photo to complete the challenge.');
    }
}

function saveBadge(badgeName, imageData) {
    let badges = JSON.parse(localStorage.getItem('badges')) || [];
    let badge = badges.find(badge => badge.name === badgeName);
    if (!badge) {
        badges.push({ name: badgeName, image: imageData });
    }
    localStorage.setItem('badges', JSON.stringify(badges));
}

function updateBadgeImage(badgeName, imageData) {
    let badges = JSON.parse(localStorage.getItem('badges')) || [];
    let badge = badges.find(badge => badge.name === badgeName);
    if (badge) {
        badge.image = imageData;
    }
    localStorage.setItem('badges', JSON.stringify(badges));
}

function loadBadges() {
    const badges = JSON.parse(localStorage.getItem('badges')) || [];
    badges.forEach(badge => {
        const badgeList = document.getElementById('badge-list');
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'badge';
        badgeDiv.innerText = `Badge: ${badge.name}`;
        if (badge.image) {
            const img = document.createElement('img');
            img.src = badge.image;
            img.alt = badge.name;
            img.width = 100;
            badgeDiv.appendChild(img);
        }
        badgeList.appendChild(badgeDiv);
    });
}
