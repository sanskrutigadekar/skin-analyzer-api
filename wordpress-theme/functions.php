<?php
/**
 * Glow & Play Theme Functions
 */

// Theme setup
function glow_play_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    
    // Register menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'glow-play'),
        'footer' => __('Footer Menu', 'glow-play')
    ));
}
add_action('after_setup_theme', 'glow_play_setup');

// Enqueue scripts and styles
function glow_play_scripts() {
    // Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
    
    // Main stylesheet
    wp_enqueue_style('glow-play-style', get_stylesheet_uri());
    
    // Custom CSS
    wp_enqueue_style('playful-style', get_template_directory_uri() . '/css/playful-style.css');
    
    // JavaScript
    wp_enqueue_script('skin-analyzer', get_template_directory_uri() . '/js/skin-analyzer.js', array(), '1.0', true);
    wp_enqueue_script('games', get_template_directory_uri() . '/js/games.js', array(), '1.0', true);
    
    // Localize script with API URL
    wp_localize_script('skin-analyzer', 'skinAnalyzer', array(
        'apiUrl' => getenv('SKIN_ANALYZER_API_URL') ?: 'https://skin-analyzer-api.onrender.com',
        'ajaxUrl' => admin_url('admin-ajax.php')
    ));
}
add_action('wp_enqueue_scripts', 'glow_play_scripts');

// Create pages on theme activation
function glow_play_create_pages() {
    $pages = array(
        'Skin Analyzer' => 'page-skin-analyzer.php',
        'Fun Games' => 'page-fun-games.php'
    );
    
    foreach ($pages as $title => $template) {
        $page = get_page_by_title($title);
        if (!$page) {
            wp_insert_post(array(
                'post_title' => $title,
                'post_content' => '',
                'post_status' => 'publish',
                'post_type' => 'page',
                'page_template' => $template
            ));
        }
    }
}
add_action('after_switch_theme', 'glow_play_create_pages');

// Add customizer options
function glow_play_customize_register($wp_customize) {
    // Add API URL setting
    $wp_customize->add_setting('api_url', array(
        'default' => 'https://skin-analyzer-api.onrender.com',
        'sanitize_callback' => 'esc_url_raw'
    ));
    
    $wp_customize->add_control('api_url', array(
        'label' => __('Skin Analyzer API URL', 'glow-play'),
        'section' => 'general',
        'type' => 'url'
    ));
}
add_action('customize_register', 'glow_play_customize_register');