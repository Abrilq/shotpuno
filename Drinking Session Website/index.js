let players = [];
let currentIndex = 0;
let firstClick = true; // Add this flag

function addPlayer() {
  const playerName = document.getElementById('playerName').value;
  if (playerName) {
    players.push(playerName);
    document.getElementById('playerName').value = ''; // Clear input field after adding player
    updatePlayerList(); // Update player list
  } else {
    alert('Please enter a name'); // Alert if no name is entered
  }
}

function nextName() {
  if (players.length > 0) {
    if (firstClick) {
      currentIndex = 1 % players.length; // Start at second item
      firstClick = false;
    } else {
      currentIndex = (currentIndex + 1) % players.length;
    }
    document.getElementById('name-display').innerText = players[currentIndex];
    updatePlayerList(); // <-- Add this line
  } else {
    // alert('Please add at least one player');
  }
}

function toggleRemovePlayer() {
  const container = document.getElementById('remove-player-container');
  const btn = document.getElementById('remove-player-btn');
  const isShown = container.classList.toggle('show');
  if (isShown) {
    btn.classList.add('remove-active');
  } else {
    btn.classList.remove('remove-active');
  }
  updatePlayerList();
}

function updatePlayerList() {
  const list = document.getElementById('player-list');
  list.innerHTML = '';
  const displayedName = document.getElementById('name-display').innerText;
  players.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${player} <button onclick="removePlayer(${index})" class="normal" id="remove-btn">Remove</button>`;
    listItem.draggable = true;
    listItem.ondragstart = (e) => onDragStart(e, index);
    listItem.ondragover = (e) => onDragOver(e, index);
    listItem.ondrop = (e) => onDrop(e, index);
    listItem.ondragend = onDragEnd;

    // Touch events for mobile
    listItem.ontouchstart = (e) => onTouchStart(e, index);
    listItem.ontouchmove = (e) => onTouchMove(e, index);
    listItem.ontouchend = (e) => onTouchEnd(e, index);

    // Dynamically highlight the displayed player
    if (player === displayedName && displayedName !== "Click to change name") {
      listItem.classList.add('active-player');
    }

    list.appendChild(listItem);
  });
  // Do NOT reset firstClick here!
}

function removePlayer(index) {
  players.splice(index, 1);
  if (currentIndex >= players.length) {
    currentIndex = 0;
  }
  updatePlayerList();
  if (players.length > 0) {
    document.getElementById('name-display').innerText = players[currentIndex];
  } else {
    document.getElementById('name-display').innerText = "Click to change name";
  }
}

// Touch drag variables
let touchStartY = null;
let touchDraggedIndex = null;

function onDragStart(e, index) {
  draggedIndex = index;
  e.dataTransfer.effectAllowed = 'move';
  e.target.style.opacity = '0.5';
}

function onDragOver(e, index) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const list = document.getElementById('player-list');
  Array.from(list.children).forEach((li, idx) => {
    if (idx === index) {
      li.classList.add('drop-target');
    } else {
      li.classList.remove('drop-target');
    }
  });
}

function onDrop(e, index) {
  e.preventDefault();
  const list = document.getElementById('player-list');
  Array.from(list.children).forEach((li) => li.classList.remove('drop-target'));
  if (draggedIndex === null || draggedIndex === index) return;
  const movedPlayer = players.splice(draggedIndex, 1)[0];
  players.splice(index, 0, movedPlayer);
  draggedIndex = null;
  updatePlayerList();
}

function onDragEnd(e) {
  e.target.style.opacity = '';
  const list = document.getElementById('player-list');
  Array.from(list.children).forEach((li) => li.classList.remove('drop-target'));
}

function onTouchStart(e, index) {
  if (e.target.tagName === 'BUTTON') return; // Don't drag when pressing remove
  touchDraggedIndex = index;
  e.target.style.opacity = '0.5';
}

function onTouchMove(e, index) {
  e.preventDefault(); // Prevent scrolling
  const touchY = e.touches[0].clientY;
  const list = document.getElementById('player-list');
  const items = Array.from(list.children);
  items.forEach((item, idx) => {
    const rect = item.getBoundingClientRect();
    if (touchY > rect.top && touchY < rect.bottom) {
      item.classList.add('drop-target');
    } else {
      item.classList.remove('drop-target');
    }
  });
}

function onTouchEnd(e, index) {
  const list = document.getElementById('player-list');
  const items = Array.from(list.children);
  let dropIndex = null;
  items.forEach((item, idx) => {
    if (item.classList.contains('drop-target')) {
      dropIndex = idx;
      item.classList.remove('drop-target');
    }
    item.style.opacity = '';
  });
  if (dropIndex !== null && dropIndex !== touchDraggedIndex) {
    const movedPlayer = players.splice(touchDraggedIndex, 1)[0];
    players.splice(dropIndex, 0, movedPlayer);
    updatePlayerList();
  } else {
    updatePlayerList();
  }
  touchDraggedIndex = null;
}

// Add this at the end of your file or after your functions

document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
    const tag = e.target.tagName.toLowerCase();
    if (
      tag === 'input' ||
      tag === 'button' ||
      tag === 'ul' ||
      tag === 'li' ||
      e.target.id === 'player-list' ||
      e.target.id === 'remove-player-container'
    ) {
      return;
    }
    nextName();
  });
});

