
const start = document.getElementById('startgamebtn');
const rules = document.getElementById('rulesbtn');
const content = document.getElementById('rulessection');


start.addEventListener('click', function() {
    window.location.href = 'game.html'; 
});


rules.addEventListener('click', function() {
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
});
