<?php
global $nmjson;
if(!isset($nmjson)){
    $nmjson = new nmjson();
}

add_shortcode('nm', 'nm_shortcode');
function nm_shortcode( $atts, $content = null ) {
    return netease_music_output();
}

add_action('template_redirect', 'netease_music_template', 1 );
function netease_music_template(){
    $page_id = nm_get_setting("pagename");

    if( !$page_id ){
        return ;
    }

    if( !is_page($page_id) ){
        return ;
    }

    include( NM_PATH . '/tpl-nm.php' );
    exit();
}

function netease_music(){

    echo netease_music_output();
}
add_action('wp_ajax_nopriv_get_music', 'netease_music_callback');
add_action( 'wp_ajax_get_music', 'netease_music_callback');
function netease_music_callback(){
    $paged = $_POST["paged"];
    $max = $_POST["max"];
    $content = get_netease_music($paged );
    if( $max > $paged ) $nav = '<div class="music-page-navi"><a class="nm-loadmore" data-max="' . $max . '" data-paged="'. ($paged + 1) .'" href=
"javascript:;">加载更多音乐</a></div>';
    $data = array("status"=>200,"data"=>$content,"nav"=>$nav);
    echo json_encode($data);
    die;
}

function netease_music_get_play_count($id){
    $count = get_option('nmpc' . $id ) ? get_option('nmpc' . $id ) : 0;
    return $count;
}

function netease_music_update_play_count($id){
    $count = netease_music_get_play_count($id) + 1;
    update_option( 'nmpc' . $id , $count);
}

function netease_music_output(){

    $size = nm_get_setting('coverwidth') ? nm_get_setting('coverwidth') : 180;
    $max_page = get_netease_max_page();
    $style = '<style>
        .album--nice{width:'.$size.'px}
        .album--nice .fxfont{height:'.$size.'px;line-height:'.$size.'px;}
        </style><div id="nm-wrapper">';
    $output = $style;
    $output .= get_netease_music();
    $output .= '</div><div class="music-page-navi">';

    if($max_page > 1) $output .= '<a class="nm-loadmore" data-paged="2" data-max="'.$max_page.'" href="javascript:;">加载更多音乐</a>';


    $output .='</div><div class="nm-copyright"><i class="fxfont nm-note"></i> <a href="http://fatesinger.com/74369" target="_blank" title="网易云音乐">网易云音乐</a></div>';
    return $output;


}

function get_netease_max_page(){
    global $nmjson;
    $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
    $contents = $nmjson->netease_user($userid);
    array_shift($contents);
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    return $max_page;
}

function get_netease_music($paged = null){
    global $nmjson;
    $index = 0;
    $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
    $row = nm_get_setting('number') ? nm_get_setting('number') : 4;
    $contents = $nmjson->netease_user($userid);
    array_shift($contents);
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    $paged = $paged ? $paged : 1;
    $contents = array_slice( $contents,( ( $paged-1 )* $per_page ), $per_page );
    $is_small =  nm_get_setting('small');
    $css = 'album--nice-list';
    $size = nm_get_setting('coverwidth') ? nm_get_setting('coverwidth') : 180;
    $output = '<div class="'. $css .'">';
    foreach($contents as $content){
        $index ++;
        $output .= '<div class="album--nice" data-type="163collect" data-thumbnail="'.$content['playlist_coverImgUrl'].'" data-id="'.$content['playlist_id'].'"  data-tooltip="'.$content['playlist_name'].'"><img src="'.$content['playlist_coverImgUrl'].'?param='.$size.'y'.$size.'">
        <i class="fxfont"></i><span class="music-info">'.$content['playlist_name'] . '<span class="play-count-wrapper">[<span class="play-count">'. netease_music_get_play_count($content['playlist_id']) . '</span>]</span></span>
</div>';

        if( $index%$row==0 && $index < $per_page) $output .= '</div><div class="'. $css .'">';
    }
    $output .='</div>';
    return $output;

}
/* add music play with footer hook */
function nm_player(){

    echo '<div class="nmplaybar">
    <div class="nmplayer-prosess"></div>
    <div class="nmplayer-wrap">
        <div class="nmplayer-info">
            <span class="nmplayer-title"></span><span class="nmplayer-time"></span><span class="nmplayer-lrc"></span>
        </div>
        <div class="nmplayer-control">
            <ul>
                <li>
                    <a id="nmplayer-prev" href="javascript:;">
                        <span class="nm-previous fxfont "></span>
                    </a>
                </li>
                <li>
                    <a id="nmplayer-button" href="javascript:;">
                        <span class="nm-pause fxfont "></span>
                    </a>
                </li>
                <li>
                    <a id="nmplayer-next" href="javascript:;">
                        <span class="nm-next fxfont"></span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div id="jp_container_N" style="display:none">
    <div id="jquery_jplayer_N" style="display:none">
        <div class="jp-playlist">
            <ul class="">
                <li></li>
            </ul>
        </div>
    </div>
</div>';
}
add_action('wp_footer','nm_player');
add_action('admin_menu', 'nm_menu');

function nm_menu() {
    add_options_page('网易云音乐设置', '网易云音乐设置', 'manage_options', basename(__FILE__), 'nm_setting_page');
    add_action( 'admin_init', 'nm_setting_group');
}

function nm_scripts(){
    wp_enqueue_style( 'nm', nm_css_url('style'), array(), NM_VERSION );
    wp_enqueue_script('jquery');
    wp_enqueue_script( 'nm',  nm_js_url('base'), array(), NM_VERSION,true );
    wp_enqueue_script( 'nmpage',  nm_js_url('page'), array(), NM_VERSION,true );
    wp_localize_script( 'nm', 'nm_ajax_url', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'swfurl' => NM_URL . 'static/jquery.jplayer.swf',
        'nonce' =>wp_create_nonce('bigfa'),
        'tworow' =>nm_get_setting('tworow')
    ));
}
add_action('wp_enqueue_scripts', 'nm_scripts', 20, 1);

add_action( 'wp_ajax_nopriv_nmjson', 'nmjson_callback' );
add_action( 'wp_ajax_nmjson', 'nmjson_callback' );
function nmjson_callback() {
    global $nmjson;

    $id = $_POST['id'];
    $type = $_POST['type'];

    $song = $nmjson->netease_playlist($id);

    $result = array(
        'msg' => 200,
        'song' => $song
    );

    header('Content-type: application/json');
    echo json_encode($result);
    exit;
}

function get_pagelink(){
    $slug = nm_get_setting('pagename');
    if($slug){
        $slug = get_permalink( get_page_by_path($slug) );
        $slug = rtrim($slug,'/\\');
        return $slug;
    }
    return false;
}

function nm_setting_group() {
    register_setting( 'nm_setting_group', 'nm_setting' );
}

function nm_setting_page(){
    @include 'nm-setting.php';
}

function nm_get_setting($key=NULL){
    $setting = get_option('nm_setting');
    return $key ? $setting[$key] : $setting;
}

function nm_delete_setting(){
    delete_option('nm_setting');
}

function nm_setting_key($key){
    if( $key ){
        return "nm_setting[$key]";
    }

    return false;
}
function nm_update_setting($setting){
    update_option('nm_setting', $setting);
}

function nm_css_url($css_url){
    return NM_URL . "/static/css/{$css_url}.css";
}

function nm_js_url($js_url){
    return NM_URL . "/static/js/{$js_url}.js";
}