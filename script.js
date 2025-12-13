// Funkcja do przewijania do sekcji
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funkcja sprawdzająca quiz
function checkQuiz() {
    let score = 0;
    let total = 4;
    let results = [];
    
    // Pytanie 1 - radio buttons
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    if (q1Answer && q1Answer.value === 'taj') {
        score++;
        results.push('Pytanie 1: Poprawna odpowiedź! Taj Mahal został wybudowany jako symbol miłości.');
    } else {
        results.push('Pytanie 1: Niepoprawna odpowiedź. Taj Mahal został wybudowany jako symbol miłości.');
    }
    
    // Pytanie 2 - select
    const q2Answer = document.querySelector('select[name="q2"]').value;
    if (q2Answer === 'peru') {
        score++;
        results.push('Pytanie 2: Poprawna odpowiedź! Machu Picchu znajduje się w Peru.');
    } else {
        results.push('Pytanie 2: Niepoprawna odpowiedź. Machu Picchu znajduje się w Peru.');
    }
    
    // Pytanie 3 - checkboxes
    const q3Answers = document.querySelectorAll('input[name="q3[]"]:checked');
    let q3Correct = true;
    let q3Selected = [];
    
    q3Answers.forEach(answer => {
        q3Selected.push(answer.value);
    });
    
    // Sprawdzamy czy zaznaczono tylko poprawne odpowiedzi
    const correctAnswers = ['china', 'taj'];
    if (q3Selected.length === correctAnswers.length && 
        q3Selected.every(val => correctAnswers.includes(val)) &&
        correctAnswers.every(val => q3Selected.includes(val))) {
        score++;
        results.push('Pytanie 3: Poprawna odpowiedź! W Azji znajdują się: Wielki Mur Chiński i Taj Mahal.');
    } else {
        results.push('Pytanie 3: Niepoprawna odpowiedź. W Azji znajdują się: Wielki Mur Chiński i Taj Mahal.');
    }
    
    // Pytanie 4 - range (zawsze poprawne, liczymy tylko udział)
    const q4Answer = document.querySelector('input[name="q4"]').value;
    score++;
    results.push(`Pytanie 4: Dziękujemy za ocenę! Twoja samoocena to ${q4Answer}/10.`);
    
    // Wyświetlenie wyników
    const resultDiv = document.getElementById('quiz-result');
    const percentage = Math.round((score / total) * 100);
    
    let resultClass = percentage >= 75 ? 'correct' : 'incorrect';
    
    resultDiv.innerHTML = `
        <h3>Twój wynik: ${score}/${total} (${percentage}%)</h3>
        <div style="text-align: left; margin-top: 1rem;">
            ${results.map(result => `<p style="margin: 0.5rem 0;">• ${result}</p>`).join('')}
        </div>
    `;
    
    resultDiv.className = resultClass;
    resultDiv.style.display = 'block';
    
    // Przewijanie do wyników
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Funkcja czyszcząca quiz
function clearQuiz() {
    // Wyczyść wszystkie radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Wyczyść wszystkie checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Resetuj select
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Resetuj range
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.value = 5;
        const output = range.nextElementSibling;
        if (output && output.tagName === 'OUTPUT') {
            output.value = 5;
        }
    });
    
    // Ukryj wyniki
    const resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
}

// Funkcja do aktualizacji wartości range
function updateRangeValue(range) {
    const output = range.nextElementSibling;
    if (output && output.tagName === 'OUTPUT') {
        output.value = range.value;
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Dodaj event listenery do wszystkich range inputów
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', function() {
            updateRangeValue(this);
        });
    });
    
    // Dodaj efekt przewijania dla menu
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
    
    // Dodaj efekt pojawiania się sekcji podczas przewijania
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Obserwuj wszystkie sekcje
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Dodaj efekt powiększenia dla galerii
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            // Prosty lightbox
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const largeImg = document.createElement('img');
            largeImg.src = this.src;
            largeImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `;
            
            overlay.appendChild(largeImg);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
        });
    });
});

// Funkcja do obsługi błędów
window.addEventListener('error', function(e) {
    console.error('Wystąpił błąd:', e.error);
});

// Obsługa zmiany rozmiaru okna
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Opcjonalnie: dostosuj układ po zmianie rozmiaru
        console.log('Rozmiar okna zmieniony');
    }, 250);
});