window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let box = 20;
    let head = [{ x: 160, y: 160 }];
    let item = { x: 80, y: 80 };
    let points = { x: 0, y: 0 };
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let intervalTime = 100;
    let gameInterval;
    let gameover = false;
    let start = false;

    document.getElementById('high-score').textContent = highScore;

    function resizeCanvas() {
        const size = Math.min(window.innerWidth - 40, 400);
        canvas.width = size;
        canvas.height = size;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function setGame() {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, intervalTime);
    }

    const level = document.getElementById('difficulty-select');
    level.addEventListener('change', (event) => {
        const value = event.target.value;
        if (value === 'easy') intervalTime = 300;
        if (value === 'medium') intervalTime = 200;
        if (value === 'hard') intervalTime = 100;
        if (start) setGame();
    });

    function randomPosition() {
        item.x = Math.floor(Math.random() * (canvas.width / box)) * box;
        item.y = Math.floor(Math.random() * (canvas.height / box)) * box;
    }

    function drawBoard() {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function drawhead() {
        ctx.fillStyle = 'green';
        head.forEach(value => {
            ctx.fillRect(value.x, value.y, box, box);
        });
    }

    function drawitem() {
        ctx.fillStyle = 'red';
        ctx.fillRect(item.x, item.y, box, box);
    }

    function gameLoop() {
        if (gameover) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();

        const newhead = { x: head[0].x + points.x, y: head[0].y + points.y };

        if (newhead.x >= canvas.width || newhead.x < 0 || newhead.y >= canvas.height || newhead.y < 0) {
            gameOver();
            return;
        }

        if (head.some((value, index) => index !== 0 && value.x === newhead.x && value.y === newhead.y)) {
            gameOver();
            return;
        }

        head.unshift(newhead);

        if (newhead.x === item.x && newhead.y === item.y) {
            score += 10;
            document.getElementById('score').textContent = score;
            randomPosition();
        } else {
            head.pop();
        }

        drawhead();
        drawitem();
    }

    function gameOver() {
        gameover = true;
        clearInterval(gameInterval);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('high-score').textContent = highScore;
        }

        setTimeout(() => {
            alert(`IT's over Bro! Your score: ${score}`);
            resetGame();
        }, 100);
    }

    function resetGame() {
        score = 0;
        document.getElementById('score').textContent = score;
        head = [{ x: 160, y: 160 }];
        points = { x: 0, y: 0 };
        gameover = false;
        start = false;
        randomPosition();
        initial();
    }

    function startGame() {
        if (!start) {
            start = true;
            setGame();
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!start) startGame();

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
                if (points.y === 0) points = { x: 0, y: -box };
                break;
            case 'ArrowDown':
                if (points.y === 0) points = { x: 0, y: box };
                break;
            case 'ArrowLeft':
                if (points.x === 0) points = { x: -box, y: 0 };
                break;
            case 'ArrowRight':
                if (points.x === 0) points = { x: box, y: 0 };
                break;
        }
    });

    document.getElementById('up-btn').addEventListener('click', () => {
        if (!start) startGame();
        if (points.y === 0) points = { x: 0, y: -box };
    });

    document.getElementById('down-btn').addEventListener('click', () => {
        if (!start) startGame();
        if (points.y === 0) points = { x: 0, y: box };
    });

    document.getElementById('left-btn').addEventListener('click', () => {
        if (!start) startGame();
        if (points.x === 0) points = { x: -box, y: 0 };
    });

    document.getElementById('right-btn').addEventListener('click', () => {
        if (!start) startGame();
        if (points.x === 0) points = { x: box, y: 0 };
    });

    let touchX = 0;
    let touchY = 0;

    canvas.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
    });

    canvas.addEventListener('touchmove', (event) => {
        if (!start) startGame();

        const touch = event.touches[0];
        const diffX = touch.clientX - touchX;
        const diffY = touch.clientY - touchY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && points.x === 0) {
                points = { x: box, y: 0 };
            } else if (diffX < 0 && points.x === 0) {
                points = { x: -box, y: 0 };
            }
        } else {
            if (diffY > 0 && points.y === 0) {
                points = { x: 0, y: box };
            } else if (diffY < 0 && points.y === 0) {
                points = { x: 0, y: -box };
            }
        }

        touchX = touch.clientX;
        touchY = touch.clientY;
    });

    function initial() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawhead();
        drawitem();
    }

    initial();
};
