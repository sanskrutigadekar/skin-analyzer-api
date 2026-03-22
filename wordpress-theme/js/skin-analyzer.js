// Skin Analyzer JavaScript
const API_URL = 'https://skin-analyzer-api-1.onrender.com/'; // Update with your Render URL

function initSkinAnalyzer() {
    const container = document.getElementById('skin-analyzer-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="upload-area" style="border: 2px dashed #FFB7A8; border-radius: 30px; padding: 40px; text-align: center; background: rgba(255,249,240,0.9); cursor: pointer;">
            <div style="font-size: 4rem; animation: bounce 2s infinite;">📸✨</div>
            <h3>Drop your photo here or click to upload!</h3>
            <p>Selfies work best in natural light 🌞</p>
            <input type="file" id="imageInput" accept="image/*" style="display: none;">
            <button id="cameraBtn" class="camera-btn" style="margin-top: 20px;">📷 Use Camera</button>
        </div>
        
        <div id="loading" style="display: none; text-align: center; padding: 40px;">
            <div style="width: 60px; height: 60px; border: 4px solid #FFE5D9; border-top-color: #FFB7A8; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <p style="margin-top: 20px;">🔍 Analyzing your beautiful skin...</p>
            <p>✨ Finding your perfect glow recommendations ✨</p>
        </div>
        
        <div id="results" style="display: none;"></div>
    `;
    
    const uploadArea = container.querySelector('.upload-area');
    const imageInput = container.querySelector('#imageInput');
    const cameraBtn = container.querySelector('#cameraBtn');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    cameraBtn.addEventListener('click', openCamera);
    imageInput.addEventListener('change', handleImageUpload);
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    await analyzeImage(file);
}

async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            canvas.toBlob(async (blob) => {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                await analyzeImage(file);
            });
            stream.getTracks().forEach(track => track.stop());
        }, 1000);
    } catch (err) {
        alert('📸 Camera access denied. Please upload a photo instead!');
    }
}

async function analyzeImage(file) {
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const uploadArea = document.querySelector('.upload-area');
    
    uploadArea.style.display = 'none';
    loading.style.display = 'block';
    results.style.display = 'none';
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.analysis);
            confettiEffect();
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
    } catch (error) {
        results.innerHTML = `
            <div style="background: #FFE5D9; border-radius: 20px; padding: 30px; text-align: center;">
                <h3>😅 Oops!</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="camera-btn" style="margin-top: 20px;">Try Again</button>
            </div>
        `;
        results.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

function displayResults(analysis) {
    const results = document.getElementById('results');
    
    results.innerHTML = `
        <div style="background: linear-gradient(135deg, #FFB7A8, #FFB347); border-radius: 30px; padding: 30px; color: white; text-align: center; margin-bottom: 20px;">
            <div style="width: 120px; height: 120px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0 auto 20px;">
                <div style="font-size: 2.5rem; font-weight: bold;">${Math.round(analysis.skin_health_score)}</div>
                <div>/100</div>
            </div>
            <h2>Your Skin Health Score</h2>
            <p>${analysis.skin_health_score >= 80 ? '✨ Glowing like a diamond! ✨' : analysis.skin_health_score >= 60 ? '🌸 Beautiful skin with room to glow! 🌸' : '💪 Every skin is beautiful! Let\'s boost that glow! 💪'}</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">🌟 Your Skin Story</h3>
            <p><strong>Texture:</strong> ${analysis.skin_texture}</p>
            <p><strong>Face Quality:</strong> ${Math.round(analysis.face_quality)}%</p>
            <p><strong>Glow Age:</strong> ${Math.round(analysis.age)} years young!</p>
            <p><strong>Style:</strong> ${analysis.gender}</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">🔍 What We Noticed</h3>
            <ul style="list-style: none; padding-left: 0;">
                ${analysis.skin_issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">💧 Your Skin Type</h3>
            <p><strong>${analysis.skin_type}</strong></p>
            <p>✨ Beauty Score: ${Math.round(analysis.beauty_score)}/100 ✨</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">🎨 Your Perfect Colors</h3>
            <h4>🌈 Your Power Colors:</h4>
            <ul style="list-style: none; padding-left: 0;">
                ${analysis.skin_color.best_colors.map(color => `<li>${color}</li>`).join('')}
            </ul>
            <h4>💄 Makeup Magic:</h4>
            <p>💋 Lips: ${analysis.skin_color.lipstick.join(', ')}</p>
            <p>🌸 Blush: ${analysis.skin_color.blush.join(', ')}</p>
            <p>👁️ Eyes: ${analysis.skin_color.eyeshadow.join(', ')}</p>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">🧴 Skincare Magic ✨</h3>
            <ul style="list-style: none; padding-left: 0;">
                ${analysis.recommendations.skincare_products.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">💄 Makeup Playtime</h3>
            <ul style="list-style: none; padding-left: 0;">
                ${analysis.recommendations.makeup_products.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
        
        <div style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 15px;">
            <h3 style="color: #FFB7A8;">🏥 Pro Care Tips</h3>
            <ul style="list-style: none; padding-left: 0;">
                ${analysis.recommendations.dermatologist_products.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
        
        <div style="background: linear-gradient(135deg, #FFE5D9, #FFF9F0); border-radius: 20px; padding: 20px; text-align: center; margin-bottom: 15px;">
            <h3>💡 ${analysis.fun_fact}</h3>
            <p style="margin-top: 10px;">✨ ${analysis.recommendations.special_tip} ✨</p>
        </div>
        
        <div style="text-align: center;">
            <button onclick="location.reload()" class="camera-btn">Analyze Another Photo ✨</button>
        </div>
    `;
    
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth' });
}

function confettiEffect() {
    for(let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
