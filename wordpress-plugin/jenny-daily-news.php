<?php
/**
 * Plugin Name: Jenny Daily News Display
 * Description: Displays daily news in a beautiful card layout using the shortcode [daily_news_list]. Shows excerpt and links to full article. Includes weather and exchange rate info.
 * Version: 1.5
 * Author: Jenny (Antigravity)
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function jenny_get_weather_data() {
    $cache_key = 'jenny_weather_data';
    $cached = get_transient( $cache_key );
    if ( $cached !== false ) {
        return $cached;
    }

    $cities = array(
        'hanoi' => array( 'name' => '하노이', 'query' => 'Hanoi' ),
        'hochiminh' => array( 'name' => '호치민', 'query' => 'Ho+Chi+Minh' ),
        'seoul' => array( 'name' => '서울', 'query' => 'Seoul' ),
    );

    $weather_data = array();
    foreach ( $cities as $key => $city ) {
        $url = 'https://wttr.in/' . $city['query'] . '?format=%t&m';
        $response = wp_remote_get( $url, array( 'timeout' => 5 ) );
        if ( ! is_wp_error( $response ) ) {
            $temp = trim( wp_remote_retrieve_body( $response ) );
            $temp = str_replace( '+', '', $temp );
            $weather_data[ $key ] = array(
                'name' => $city['name'],
                'temp' => $temp,
            );
        } else {
            $weather_data[ $key ] = array(
                'name' => $city['name'],
                'temp' => '-',
            );
        }
    }

    set_transient( $cache_key, $weather_data, 30 * MINUTE_IN_SECONDS );
    return $weather_data;
}

function jenny_get_exchange_data() {
    $cache_key = 'jenny_exchange_data';
    $cached = get_transient( $cache_key );
    if ( $cached !== false ) {
        return $cached;
    }

    $exchange_data = array(
        'usd' => '-',
        'krw' => '-',
    );

    $url = 'https://open.er-api.com/v6/latest/VND';
    $response = wp_remote_get( $url, array( 'timeout' => 5 ) );
    if ( ! is_wp_error( $response ) ) {
        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( isset( $body['rates'] ) ) {
            if ( isset( $body['rates']['USD'] ) ) {
                $usd_rate = 1 / $body['rates']['USD'];
                $exchange_data['usd'] = number_format( $usd_rate, 0 );
            }
            if ( isset( $body['rates']['KRW'] ) ) {
                $krw_rate = 1 / $body['rates']['KRW'];
                $exchange_data['krw'] = number_format( $krw_rate, 2 );
            }
        }
    }

    set_transient( $cache_key, $exchange_data, 60 * MINUTE_IN_SECONDS );
    return $exchange_data;
}

function jenny_register_meta_fields() {
    if ( function_exists( 'register_post_meta' ) ) {
        register_post_meta( 'post', 'news_category', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    }
}
add_action( 'init', 'jenny_register_meta_fields' );

function jenny_daily_news_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'count' => 12,
        'category' => 31,
    ), $atts );

    $selected_date = '';
    if ( isset( $_GET['news_date'] ) ) {
        $selected_date = sanitize_text_field( $_GET['news_date'] );
    }
    $is_filtered = ( $selected_date !== '' );

    $args = array(
        'post_type' => 'post',
        'posts_per_page' => $is_filtered ? 50 : intval( $atts['count'] ),
        'cat' => intval( $atts['category'] ),
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );

    if ( $is_filtered ) {
        $date_parts = explode( '-', $selected_date );
        if ( count( $date_parts ) === 3 ) {
            $args['date_query'] = array(
                array(
                    'year'  => intval( $date_parts[0] ),
                    'month' => intval( $date_parts[1] ),
                    'day'   => intval( $date_parts[2] ),
                ),
            );
        }
    }

    $query = new WP_Query( $args );

    $date_args = array(
        'post_type' => 'post',
        'posts_per_page' => 100,
        'cat' => intval( $atts['category'] ),
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    $date_query = new WP_Query( $date_args );
    $available_dates = array();
    while ( $date_query->have_posts() ) {
        $date_query->the_post();
        $post_date = get_the_date( 'Y-m-d' );
        if ( ! in_array( $post_date, $available_dates ) ) {
            $available_dates[] = $post_date;
        }
    }
    wp_reset_postdata();

    $page_url = get_permalink();
    
    $weather = jenny_get_weather_data();
    $exchange = jenny_get_exchange_data();
    
    $output = '<div class="jenny-date-filter">';
    $output .= '<div class="jenny-filter-row">';
    
    $output .= '<div class="jenny-info-section">';
    $output .= '<div class="jenny-weather-box">';
    $output .= '<span class="jenny-info-label">날씨</span>';
    foreach ( $weather as $city ) {
        $output .= '<span class="jenny-weather-item">' . esc_html( $city['name'] ) . ' ' . esc_html( $city['temp'] ) . '</span>';
    }
    $output .= '</div>';
    $output .= '<div class="jenny-exchange-box">';
    $output .= '<span class="jenny-info-label">환율</span>';
    $output .= '<span class="jenny-exchange-item">USD ' . esc_html( $exchange['usd'] ) . '₫</span>';
    $output .= '<span class="jenny-exchange-item">KRW ' . esc_html( $exchange['krw'] ) . '₫</span>';
    $output .= '</div>';
    $output .= '</div>';
    
    if ( $is_filtered ) {
        $output .= '<a href="' . esc_url( $page_url ) . '" class="jenny-filter-btn">오늘의 뉴스</a>';
    } else {
        $output .= '<span class="jenny-filter-btn active">오늘의 뉴스</span>';
    }
    
    $output .= '<div class="jenny-archive-wrapper">';
    if ( $is_filtered ) {
        $output .= '<span class="jenny-filter-btn jenny-archive-btn active">지난 뉴스 보기 ▼</span>';
    } else {
        $output .= '<span class="jenny-filter-btn jenny-archive-btn">지난 뉴스 보기 ▼</span>';
    }
    $output .= '<div class="jenny-date-dropdown">';
    
    foreach ( $available_dates as $date ) {
        $date_obj = new DateTime( $date );
        $date_display = $date_obj->format( 'Y' ) . '년 ' . $date_obj->format( 'm' ) . '월 ' . $date_obj->format( 'd' ) . '일';
        $date_class = ( $selected_date === $date ) ? ' selected' : '';
        $output .= '<a href="' . esc_url( add_query_arg( 'news_date', $date, $page_url ) ) . '" class="jenny-date-option' . $date_class . '">' . esc_html( $date_display ) . '</a>';
    }
    
    $output .= '</div>';
    $output .= '</div>';
    $output .= '</div>';
    
    if ( $is_filtered ) {
        $sel_date_obj = new DateTime( $selected_date );
        $display_date = $sel_date_obj->format( 'Y' ) . '년 ' . $sel_date_obj->format( 'm' ) . '월 ' . $sel_date_obj->format( 'd' ) . '일';
        $output .= '<div class="jenny-filter-info">' . esc_html( $display_date ) . ' 뉴스를 보고 있습니다. <a href="' . esc_url( $page_url ) . '">오늘의 뉴스로 돌아가기</a></div>';
    }
    
    $output .= '</div>';

    if ( ! $query->have_posts() ) {
        $output .= '<p style="text-align:center; padding: 40px 20px; color: #6b7280;">선택한 날짜에 등록된 뉴스가 없습니다.</p>';
        $output .= jenny_get_styles();
        return $output;
    }

    $output .= '<div class="jenny-news-grid">';

    while ( $query->have_posts() ) {
        $query->the_post();
        
        $thumb_url = get_the_post_thumbnail_url( get_the_ID(), 'medium_large' );
        if ( ! $thumb_url ) {
            $thumb_url = 'https://via.placeholder.com/600x400?text=Xin+Chao';
        }

        $news_category = get_post_meta( get_the_ID(), 'news_category', true );
        if ( ! empty( $news_category ) ) {
            $category_map = array(
                'Society' => '사회',
                'Economy' => '경제',
                'Culture' => '문화',
                'Policy' => '정책',
                'Korea-Vietnam' => '한-베',
            );
            $cat_name = isset( $category_map[ $news_category ] ) ? $category_map[ $news_category ] : $news_category;
        } else {
            $categories = get_the_category();
            $cat_name = ! empty( $categories ) ? $categories[0]->name : '뉴스';
        }
        
        $excerpt = get_the_excerpt();
        if ( empty( $excerpt ) ) {
            $excerpt = wp_trim_words( get_the_content(), 20 );
        }

        $link_url = get_permalink();

        $output .= '<div class="jenny-news-card">';
        $output .= '<div class="jenny-card-image">';
        $output .= '<a href="' . esc_url( $link_url ) . '">';
        $output .= '<img src="' . esc_url( $thumb_url ) . '" alt="' . esc_attr( get_the_title() ) . '">';
        $output .= '</a>';
        $output .= '<span class="jenny-badge">' . esc_html( $cat_name ) . '</span>';
        $output .= '</div>';
        $output .= '<div class="jenny-content">';
        $output .= '<div class="jenny-date">' . get_the_date( 'Y.m.d H:i' ) . '</div>';
        $output .= '<h3 class="jenny-title"><a href="' . esc_url( $link_url ) . '">' . get_the_title() . '</a></h3>';
        $output .= '<div class="jenny-excerpt">' . $excerpt . '</div>';
        $output .= '<a href="' . esc_url( $link_url ) . '" class="jenny-link">자세히 보기 →</a>';
        $output .= '</div>';
        $output .= '</div>';
    }

    $output .= '</div>';

    wp_reset_postdata();

    $output .= jenny_get_styles();

    return $output;
}
add_shortcode( 'daily_news_list', 'jenny_daily_news_shortcode' );

function jenny_get_styles() {
    return '<style>
        .jenny-date-filter {
            margin-bottom: 24px;
            padding: 16px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .jenny-filter-row {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }
        .jenny-info-section {
            display: flex;
            gap: 16px;
            align-items: center;
            margin-right: auto;
        }
        .jenny-weather-box,
        .jenny-exchange-box {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #374151;
        }
        .jenny-info-label {
            font-weight: 700;
            color: #ea580c;
            padding: 4px 8px;
            background: #fef3c7;
            border-radius: 4px;
            font-size: 12px;
        }
        .jenny-weather-item,
        .jenny-exchange-item {
            padding: 4px 8px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
        }
        @media (max-width: 768px) {
            .jenny-info-section {
                width: 100%;
                margin-bottom: 8px;
                flex-wrap: wrap;
            }
        }
        .jenny-filter-btn {
            display: inline-block;
            padding: 10px 20px;
            background: #f3f4f6;
            color: #374151;
            text-decoration: none;
            border: 1px solid #e5e7eb;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
        .jenny-filter-btn:hover {
            background: #e5e7eb;
            color: #111827;
        }
        .jenny-filter-btn.active {
            background: #ea580c;
            color: #ffffff;
            border-color: #ea580c;
        }
        .jenny-archive-wrapper {
            position: relative;
        }
        .jenny-date-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 100;
            min-width: 180px;
            max-height: 300px;
            overflow-y: auto;
        }
        .jenny-archive-wrapper:hover .jenny-date-dropdown {
            display: block;
        }
        .jenny-date-option {
            display: block;
            padding: 10px 16px;
            color: #374151;
            text-decoration: none;
            font-size: 14px;
            border-bottom: 1px solid #f3f4f6;
        }
        .jenny-date-option:hover {
            background: #f3f4f6;
        }
        .jenny-date-option.selected {
            background: #fef3c7;
            color: #ea580c;
            font-weight: 600;
        }
        .jenny-date-option:last-child {
            border-bottom: none;
        }
        .jenny-filter-info {
            margin-top: 12px;
            padding: 10px 16px;
            background: #fef3c7;
            color: #92400e;
            font-size: 14px;
            border-left: 3px solid #ea580c;
        }
        .jenny-filter-info a {
            color: #ea580c;
            font-weight: 600;
        }
        .jenny-news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
            padding: 20px 0;
        }
        .jenny-news-card {
            background: #ffffff;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
        }
        .jenny-news-card:hover {
            border-color: #9ca3af;
        }
        .jenny-card-image {
            position: relative;
            padding-top: 56.25%;
            overflow: hidden;
        }
        .jenny-card-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .jenny-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #ffffff;
            color: #ea580c;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid #e5e7eb;
            z-index: 10;
        }
        .jenny-content {
            padding: 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            text-align: left;
        }
        .jenny-date {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .jenny-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 12px 0;
            line-height: 1.4;
        }
        .jenny-title a {
            color: inherit;
            text-decoration: none;
        }
        .jenny-excerpt {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        .jenny-link {
            font-size: 14px;
            font-weight: 600;
            color: #4b5563;
            text-decoration: none;
            margin-top: auto;
        }
        .jenny-link:hover {
            color: #ea580c;
        }
    </style>';
}
