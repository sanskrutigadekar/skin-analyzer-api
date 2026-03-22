// Fun Games JavaScript
function initGames() {
    const container = document.getElementById('games-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
            <div class="game-card" onclick="openSkinQuiz()" style="background: white; border-radius: 25px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s;">
                <div style="font-size: 3rem;">🔍</div>
                <h3>Guess the Skin Type!</h3>
                <p>Test your knowledge about different skin types</p>
                <span style="color: #FFB7A8;">🎮 Play Now →</span>
            </div>
            
            <div class="game-card" onclick="openRiddleGame()" style="background: white; border-radius: 25px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s;">
                <div style="font-size: 3rem;">🤔</div>
                <h3>Riddle Me Glow</h3>
                <p>Solve fun riddles about skincare and beauty</p>
                <span style="color: #FFB7A8;">🎮 Play Now →</span>
            </div>
            
            <div class="game-card" onclick="openMemoryGame()" style="background: white; border-radius: 25px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s;">
                <div style="font-size: 3rem;">🧠</div>
                <h3>Memory Match</h3>
                <p>Match skincare products and ingredients</p>
                <span style="color: #FFB7A8;">🎮 Play Now →</span>
            </div>
            
            <div class="game-card" onclick="openWheelGame()" style="background: white; border-radius: 25px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s;">
                <div style="font-size: 3rem;">🎡</div>
                <h3>Spin the Glow Wheel</h3>
                <p>Get random skincare tips and surprises!</p>
                <span style="color: #FFB7A8;">🎮 Play Now →</span>
            </div>
        </div>
    `;
    
    // Add hover effects
    const cards = container.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(255,183,168,0.3)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

// Modal system
let currentModal = null;

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #FFF9F0;
        border-radius: 30px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 2rem;
        cursor: pointer;
        color: #FFB7A8;
    `;
    closeBtn.onclick = () => modal.remove();
    
    const titleElem = document.createElement('h2');
    titleElem.textContent = title;
    titleElem.style.color = '#FFB7A8';
    titleElem.style.marginBottom = '20px';
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(titleElem);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    return modal;
}

// Skin Type Quiz
function openSkinQuiz() {
    const questions = [
        {
            text: "What skin type feels tight and may have flaky patches?",
            options: ["Oily Skin", "Dry Skin", "Combination Skin", "Normal Skin"],
            correct: 1
        },
        {
            text: "Which skin type is prone to excess oil and enlarged pores?",
            options: ["Dry Skin", "Combination Skin", "Oily Skin", "Sensitive Skin"],
            correct: 2
        },
        {
            text: "What's the best moisturizer ingredient for oily skin?",
            options: ["Coconut Oil", "Shea Butter", "Hyaluronic Acid", "Petroleum Jelly"],
            correct: 2
        },
        {
            text: "What does SPF protect your skin from?",
            options: ["Pollution", "UV Rays", "Bacteria", "Wind"],
            correct: 1
        }
    ];
    
    let score = 0;
    let current = 0;
    
    function showQuestion() {
        if (current >= questions.length) {
            content.innerHTML = `
                <div style="text-align: center;">
                    <h3>🎉 Game Complete!</h3>
                    <p>Your final score: ${score}/${questions.length}</p>
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #FFB7A8, #FFB347); color: white; border: none; padding: 10px 20px; border-radius: 50px; margin-top: 20px; cursor: pointer;">Play Again</button>
                </div>
            `;
            return;
        }
        
        const q = questions[current];
        content.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${q.text}</p>
            <div id="options"></div>
            <p style="margin-top: 20px;">Score: ${score}/${questions.length}</p>
        `;
        
        const optionsDiv = content.querySelector('#options');
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.style.cssText = `
                display: block;
                width: 100%;
                margin: 10px 0;
                padding: 10px;
                background: white;
                border: 2px solid #FFB7A8;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            btn.onmouseenter = () => btn.style.background = '#FFE5D9';
            btn.onmouseleave = () => btn.style.background = 'white';
            btn.onclick = () => {
                if (idx === q.correct) {
                    score++;
                    alert('🎉 Correct! +1 point');
                } else {
                    alert(`❌ Oops! The correct answer was: ${q.options[q.correct]}`);
                }
                current++;
                showQuestion();
            };
            optionsDiv.appendChild(btn);
        });
    }
    
    const content = document.createElement('div');
    const modal = createModal('🔍 Guess the Skin Type!', content);
    showQuestion();
}

// Riddle Game
function openRiddleGame() {
    const riddles = [
        { q: "I help your skin stay hydrated and plump. You can find me in serums and creams. What am I?", a: "hyaluronic acid" },
        { q: "I'm a vitamin that helps with skin brightness and is found in oranges. What vitamin am I?", a: "vitamin c" },
        { q: "I protect your skin from the sun. You should wear me every day. What am I?", a: "sunscreen" },
        { q: "I remove dead skin cells to reveal fresh skin. I'm often found in scrubs. What am I?", a: "exfoliator" }
    ];
    
    let score = 0;
    let current = 0;
    
    function showRiddle() {
        if (current >= riddles.length) {
            content.innerHTML = `
                <div style="text-align: center;">
                    <h3>🎉 Amazing! You solved all riddles!</h3>
                    <p>Your score: ${score}/${riddles.length}</p>
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #FFB7A8, #FFB347); color: white; border: none; padding: 10px 20px; border-radius: 50px; margin-top: 20px; cursor: pointer;">Play Again</button>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${riddles[current].q}</p>
            <input type="text" id="answer" placeholder="Your answer..." style="width: 100%; padding: 10px; border: 2px solid #FFB7A8; border-radius: 10px; margin-bottom: 10px;">
            <button id="submit" style="background: linear-gradient(135deg, #FFB7A8, #FFB347); color: white; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer;">Submit Answer</button>
            <p id="feedback" style="margin-top: 10px;"></p>
            <p style="margin-top: 20px;">Score: ${score}/${riddles.length}</p>
        `;
        
        document.getElementById('submit').onclick = () => {
            const answer = document.getElementById('answer').value.toLowerCase().trim();
            const feedback = document.getElementById('feedback');
            
            if (answer === riddles[current].a) {
                score++;
                feedback.innerHTML = '🎉 Correct! +1 point';
                feedback.style.color = 'green';
                setTimeout(() => {
                    current++;
                    showRiddle();
                }, 1500);
            } else {
                feedback.innerHTML = `❌ Not quite! The answer was: ${riddles[current].a}`;
                feedback.style.color = 'red';
                setTimeout(() => {
                    current++;
                    showRiddle();
                }, 2000);
            }
        };
    }
    
    const content = document.createElement('div');
    const modal = createModal('🤔 Riddle Me Glow', content);
    showRiddle();
}

// Memory Game
function openMemoryGame() {
    const items = ['🧴', '💄', '🧖‍♀️', '✨', '🌞', '💧'];
    let cards = [...items, ...items];
    let flipped = [];
    let matched = [];
    
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function renderBoard() {
        const grid = content.querySelector('#memoryGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        cards.forEach((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            const cardDiv = document.createElement('div');
            cardDiv.textContent = isFlipped ? card : '?';
            cardDiv.style.cssText = `
                background: #FFE5D9;
                border: 2px solid #FFB7A8;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                font-size: 2rem;
                cursor: pointer;
                transition: all 0.3s;
            `;
            cardDiv.onclick = () => {
                if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
                flipped.push(index);
                renderBoard();
                
                if (flipped.length === 2) {
                    setTimeout(checkMatch, 500);
                }
            };
            grid.appendChild(cardDiv);
        });
    }
    
    function checkMatch() {
        const [first, second] = flipped;
        if (cards[first] === cards[second]) {
            matched.push(first, second);
        }
        flipped = [];
        renderBoard();
        
        if (matched.length === cards.length) {
            setTimeout(() => {
                alert('🎉 Congratulations! You completed the memory game! 🎉');
                modal.remove();
            }, 100);
        }
    }
    
    cards = shuffle(cards);
    const content = document.createElement('div');
    const modal = createModal('🧠 Memory Match', content);
    
    content.innerHTML = `
        <div id="memoryGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;"></div>
        <p>Matches: ${matched.length/2}/${items.length}</p>
        <button onclick="location.reload()" style="background: linear-gradient(135deg, #FFB7A8, #FFB347); color: white; border: none; padding: 10px 20px; border-radius: 50px; cursor: pointer;">New Game</button>
    `;
    
    renderBoard();
}

// Wheel of Glow
function openWheelGame() {
    const tips = [
        "💧 Drink more water for glowing skin!",
        "🌙 Never skip your nighttime skincare routine!",
        "🧴 Always wear sunscreen, even indoors!",
        "🥑 Eat healthy fats for plump skin!",
        "😴 Get 7-8 hours of sleep for skin repair!",
        "🧖‍♀️ Exfoliate 2-3 times a week!",
        "🌸 Use vitamin C serum for brightness!",
        "✨ Your skin is unique and beautiful!"
    ];
    
    let spinning = false;
    
    const content = document.createElement('div');
    content.innerHTML = `
        <div style="text-align: center;">
            <div id="wheel" style="width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(from 0deg, #FFB7A8, #FFE5D9, #FFB347, #C1E1C1, #E6E6FA); margin: 20px auto; position: relative; transition: transform 3s ease-out;"></div>
            <button id="spinBtn" style="background: linear-gradient(135deg, #FFB7A8, #FFB347); color: white; border: none; padding: 12px 30px; border-radius: 50px; cursor: pointer; margin: 20px 0;">Spin!</button>
            <div id="result" style="margin-top: 20px; padding: 15px; background: white; border-radius: 15px;"></div>
        </div>
    `;
    
    const modal = createModal('🎡 Spin the Glow Wheel!', content);
    
    document.getElementById('spinBtn').onclick = () => {
        if (spinning) return;
        spinning = true;
        
        const wheel = document.getElementById('wheel');
        const randomSpin = Math.floor(Math.random() * 360) + 720;
        wheel.style.transform = `rotate(${randomSpin}deg)`;
        
        setTimeout(() => {
            const finalRotation = randomSpin % 360;
            const tipIndex = Math.floor(finalRotation / 45) % tips.length;
            document.getElementById('result').innerHTML = `
                <h3>🎁 Your Glow Tip!</h3>
                <p style="font-size: 1.2rem;">${tips[tipIndex]}</p>
                <p>✨ Come back for another tip! ✨</p>
            `;
            spinning = false;
        }, 3000);
    };
}