let clickCount = 0;
let username = '';
let clickMultiplier = 1;
let multiplierCost = 100;
let passiveClickers = {
    green: { cost: 200, cps: 1, owned: 0 },
    yellow: { cost: 500, cps: 5, owned: 0 },
    red: { cost: 1000, cps: 10, owned: 0 }
};
let passiveCps = 0;
let balls = [];

function login() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('main').style.display = 'block';
        document.getElementById('shop').style.display = 'block';
        document.getElementById('greeting').innerText = `Hello, ${username}!`;
        updateRanking();
        updateShop();
        startPassiveClicks();
        startAnimation();
    } else {
        showAlert('Please enter a username.');
    }
}

function incrementClicks() {
    clickCount += clickMultiplier;
    document.getElementById('clickCount').innerText = clickCount;
    updateRanking();
    if (clickCount <= 100 && clickCount % 100 === 0) {
        createConfetti();
        playApplause();
    }
}

function updateRanking() {
    let ranking = [
        { user: username, clicks: clickCount }
    ];

    ranking.sort((a, b) => b.clicks - a.clicks);

    let rankingList = document.getElementById('ranking');
    rankingList.innerHTML = '';
    ranking.forEach(item => {
        let li = document.createElement('li');
        li.innerText = `${item.user}: ${item.clicks} clicks`;
        rankingList.appendChild(li);
    });
}

function createConfetti() {
    let confettiContainer = document.getElementById('confetti');
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confettiContainer.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function playApplause() {
    let applause = document.getElementById('applause-sound');
    applause.play();
}

function buyClickMultiplier() {
    if (clickCount >= multiplierCost) {
        clickCount -= multiplierCost;
        clickMultiplier += 1;
        multiplierCost = Math.floor(multiplierCost * 1.5);
        document.getElementById('clickCount').innerText = clickCount;
        updateShop();
        showAlert('You have purchased a click multiplier! Each click is now worth more.');
    } else {
        showAlert('You do not have enough clicks to buy this.');
    }
}

function buyPassiveClicker(color) {
    if (clickCount >= passiveClickers[color].cost) {
        clickCount -= passiveClickers[color].cost;
        passiveClickers[color].owned += 1;
        passiveClickers[color].cost = Math.floor(passiveClickers[color].cost * 1.5);
        passiveCps += passiveClickers[color].cps;
        document.getElementById('clickCount').innerText = clickCount;
        updateShop();
        addBouncingBall(color);
        showAlert(`You have purchased a ${color} clicker! You now gain more clicks per second.`);
    } else {
        showAlert('You do not have enough clicks to buy this.');
    }
}

function startPassiveClicks() {
    setInterval(() => {
        clickCount += passiveCps;
        document.getElementById('clickCount').innerText = clickCount;
        updateRanking();
    }, 1000);
}

function updateShop() {
    document.querySelector('.shop-item button').innerText = `Buy for ${multiplierCost} clicks`;
    document.querySelector('button.green').innerText = `Buy Green for ${passiveClickers.green.cost} clicks (${passiveClickers.green.owned})`;
    document.querySelector('button.yellow').innerText = `Buy Yellow for ${passiveClickers.yellow.cost} clicks (${passiveClickers.yellow.owned})`;
    document.querySelector('button.red').innerText = `Buy Red for ${passiveClickers.red.cost} clicks (${passiveClickers.red.owned})`;
}

function showAlert(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alertBox').style.display = 'block';
}

function closeAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

function addBouncingBall(color) {
    const ball = {
        element: document.createElement('div'),
        dx: (Math.random() * 2 - 1) * 2,
        dy: (Math.random() * 2 - 1) * 2
    };
    ball.element.classList.add('ball', color);
    ball.element.style.left = Math.random() * 100 + 'vw';
    ball.element.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(ball.element);
    balls.push(ball);
}

function startAnimation() {
    function update() {
        balls.forEach(ball => {
            let rect = ball.element.getBoundingClientRect();

            if (rect.left <= 0 || rect.right >= window.innerWidth) {
                ball.dx *= -1;
            }
            if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
                ball.dy *= -1;
            }

            ball.element.style.left = rect.left + ball.dx + 'px';
            ball.element.style.top = rect.top + ball.dy + 'px';
        });
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
