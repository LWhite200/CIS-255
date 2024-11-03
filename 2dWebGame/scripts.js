const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player images for idle animation and ledge grab
const playerImages = [
    'img/ply/p1.png', 
    'img/ply/p2.png', 
    'img/ply/p3.png'
];
const ledgeGrabImageSrc = 'img/ply/pLG.png';
let currentImageIndex = 0;
let animationCounter = 0;
let playerImage = new Image();
playerImage.src = playerImages[currentImageIndex];


// Player properties
const player = {
    x: 100,
    y: 200,
    width: 50,
    height: 50,
    speed: 4,
    dx: 0,
    dy: 0,
    jumpPower: -12,
    gravity: 0.6,
    isJumping: false,
    onGround: false,
    groundBuffer: 5, // Buffer distance for ground detection
    facingRight: true,
    isLedgeGrabbing: false
};

// Platform properties (added a third platform)
const platforms = [
    { x: 150, y: 300, width: 200, height: 20 },
    { x: 450, y: 250, width: 100, height: 20 },
    { x: 650, y: 300, width: 200, height: 20 },

    { x: 100, y: 390, width: 800, height: 20 },
];

// Handle keyboard input
const keys = {
    right: false,
    left: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'd') {
        keys.right = true;
        player.facingRight = true;
    }
    if (e.key === 'a') {
        keys.left = true;
        player.facingRight = false;
    }
    if (e.key === ' ' && (player.onGround || player.isLedgeGrabbing)) {
        player.dy = player.jumpPower;
        player.onGround = false;
        player.isLedgeGrabbing = false; // Release ledge grab on jump
        player.isJumping = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'd') keys.right = false;
    if (e.key === 'a') keys.left = false;
});

// Game loop
function gameLoop() {

    if(player.y > 1000) {
        player.x = 100;
        player.y = 200;
    }



    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.right) player.dx = player.speed;
    else if (keys.left) player.dx = -player.speed;
    else player.dx = 0;

    // Apply gravity if not ledge grabbing
    if (!player.isLedgeGrabbing) {
        player.dy += player.gravity;
    }

    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    player.onGround = false;
    let ledgesGrab = 0;
    for (const platform of platforms) {
        
        // Normal Ground Collision
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height + player.groundBuffer > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.onGround = true;
            break;
        }

        // Ledge grab detection
        if (
            player.x + player.width > platform.x && 
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y && 
            player.y + player.height < platform.y + player.height 
        ) {
            ledgesGrab += 1
            player.y = platform.y - 20;
            player.isLedgeGrabbing = true;
            player.isJumping = false;
            player.dy = 0; 
            playerImage.src = ledgeGrabImageSrc; 
            break;
        }
    }

    // because ledge grabbing logic is choo choo brain
    if( ledgesGrab != 1) {
        player.isLedgeGrabbing = false;
    }

    // Update player animation if not ledge grabbing
    if (player.onGround && !player.isLedgeGrabbing) {
        animationCounter++;
        if (animationCounter > 15) { // Change frame every 15 frames
            currentImageIndex = (currentImageIndex + 1) % playerImages.length;
            playerImage.src = playerImages[currentImageIndex];
            animationCounter = 0;
        }
    }

    // Draw platforms
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; 
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player image with facing direction
    ctx.save();
    if (!player.facingRight) {
        ctx.translate(player.x + player.width, player.y); 
        ctx.scale(-1, 1); 
        ctx.drawImage(playerImage, 0, 0, player.width, player.height);
    } else {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
    ctx.restore();

    // hitbox
    //ctx.strokeStyle = player.onGround ? 'green' : 'red';
    //ctx.lineWidth = 2;
    //ctx.strokeRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();