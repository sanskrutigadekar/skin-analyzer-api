<?php
/*
Template Name: Fun Games
*/

get_header();
?>

<div class="container">
    <div class="play-card" style="text-align: center;">
        <h1>🎪 Play & Glow! 🎨</h1>
        <p>Take a break and have some fun while we analyze your skin!</p>
    </div>
    
    <div id="games-container"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initGames === 'function') {
        initGames();
    }
});
</script>

<?php
get_footer();
?>