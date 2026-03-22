<?php
/*
Template Name: Skin Analyzer
*/

get_header();
?>

<div class="container">
    <div class="play-card" style="text-align: center;">
        <h1>✨ Discover Your Glow! ✨</h1>
        <p>Snap a selfie and let's explore your skin's unique beauty!</p>
    </div>
    
    <div id="skin-analyzer-container"></div>
</div>

<script>
// This will be populated by skin-analyzer.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initSkinAnalyzer === 'function') {
        initSkinAnalyzer();
    }
});
</script>

<?php
get_footer();
?>