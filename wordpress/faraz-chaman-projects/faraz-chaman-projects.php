<?php
/**
 * Plugin Name: فراز چمن - مدیریت پروژه‌ها
 * Description: نوع پست «پروژه» را برای مدیریت نمونه‌کارهای سایت اضافه می‌کند (شهر، دسته‌بندی، کاربری، متراژ، گالری تصاویر) و آن را از طریق REST API در اختیار سایت React قرار می‌دهد.
 * Version: 1.0.0
 * Author: Faraz Chaman
 * Text Domain: faraz-chaman-projects
 */

if (!defined('ABSPATH')) {
    exit; // جلوگیری از دسترسی مستقیم به فایل
}

define('FCP_POST_TYPE', 'project');
define('FCP_NONCE_ACTION', 'fcp_save_project_meta');
define('FCP_NONCE_NAME', 'fcp_project_meta_nonce');

/**
 * لیست ثابت دسته‌بندی‌ها و کاربری‌ها — دقیقاً هم‌راستا با
 * projectCategories و usageTypes در سایت (src/data.js) تا فیلترهای
 * صفحه‌ی پروژه‌ها بدون تغییر با داده‌های وردپرس کار کنند.
 */
function fcp_categories() {
    return [
        'sport'   => 'زمین ورزشی',
        'roof'    => 'روف گاردن',
        'kids'    => 'فضای بازی کودکان',
        'villa'   => 'محوطه‌سازی ویلا',
        'terrace' => 'تراس و بالکن',
        'office'  => 'فضای اداری و تجاری',
        'park'    => 'پارک و فضای عمومی',
    ];
}

function fcp_usages() {
    return [
        'residential' => 'مسکونی',
        'commercial'  => 'تجاری',
        'office'      => 'اداری',
        'public'      => 'عمومی',
        'sport'       => 'ورزشی',
    ];
}

/* =========================================================
 * ۱) ثبت نوع پست «پروژه»
 *    این کار به‌تنهایی یک منوی «پروژه‌ها» با دو زیرمنوی
 *    «افزودن پروژه جدید» و «همه‌ی پروژه‌ها» (شامل ویرایش/حذف
 *    برای هر ردیف) در پیشخوان وردپرس می‌سازد.
 * ========================================================= */
add_action('init', function () {
    register_post_type(FCP_POST_TYPE, [
        'labels' => [
            'name'                  => 'پروژه‌ها',
            'singular_name'         => 'پروژه',
            'menu_name'             => 'پروژه‌ها',
            'add_new'               => 'افزودن پروژه',
            'add_new_item'          => 'افزودن پروژه جدید',
            'edit_item'             => 'ویرایش پروژه',
            'new_item'              => 'پروژه جدید',
            'view_item'             => 'مشاهده پروژه',
            'view_items'            => 'مشاهده پروژه‌ها',
            'search_items'          => 'جستجوی پروژه',
            'not_found'             => 'پروژه‌ای یافت نشد',
            'not_found_in_trash'    => 'پروژه‌ای در زباله‌دان یافت نشد',
            'all_items'             => 'همه‌ی پروژه‌ها',
            'featured_image'        => 'تصویر اصلی پروژه',
            'set_featured_image'    => 'انتخاب تصویر اصلی',
            'remove_featured_image' => 'حذف تصویر اصلی',
        ],
        'public'        => true,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'menu_icon'     => 'dashicons-location-alt',
        'menu_position' => 21,
        'supports'      => ['title', 'editor', 'thumbnail'],
        'show_in_rest'  => true,
        'rest_base'     => 'project',
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'project'],
    ]);
});

/* =========================================================
 * ۲) ثبت فیلدهای اختصاصی پروژه به‌عنوان post meta
 *    با show_in_rest=true این مقادیر مستقیماً داخل پاسخ
 *    /wp-json/wp/v2/project در فیلد meta قابل خواندن هستند.
 * ========================================================= */
add_action('init', function () {
    $string_fields = ['project_city', 'project_city_key', 'project_category', 'project_usage', 'project_badge'];

    foreach ($string_fields as $key) {
        register_post_meta(FCP_POST_TYPE, $key, [
            'type'              => 'string',
            'single'            => true,
            'default'           => '',
            'show_in_rest'      => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback'     => function ($allowed, $meta_key, $post_id) {
                return current_user_can('edit_post', $post_id);
            },
        ]);
    }

    register_post_meta(FCP_POST_TYPE, 'project_area', [
        'type'              => 'integer',
        'single'            => true,
        'default'           => 0,
        'show_in_rest'      => true,
        'sanitize_callback' => 'absint',
        'auth_callback'     => function ($allowed, $meta_key, $post_id) {
            return current_user_can('edit_post', $post_id);
        },
    ]);

    register_post_meta(FCP_POST_TYPE, 'project_gallery', [
        'type'         => 'array',
        'single'       => true,
        'default'      => [],
        'show_in_rest' => [
            'schema' => [
                'type'  => 'array',
                'items' => ['type' => 'string'],
            ],
        ],
        'sanitize_callback' => function ($value) {
            return array_map('esc_url_raw', (array) $value);
        },
        'auth_callback' => function ($allowed, $meta_key, $post_id) {
            return current_user_can('edit_post', $post_id);
        },
    ]);
});

/* =========================================================
 * ۳) باکس «مشخصات پروژه» در صفحه‌ی ویرایش
 * ========================================================= */
add_action('add_meta_boxes', function () {
    add_meta_box('fcp_project_details', 'مشخصات پروژه', 'fcp_render_details_box', FCP_POST_TYPE, 'normal', 'high');
    add_meta_box('fcp_project_gallery', 'گالری تصاویر پروژه', 'fcp_render_gallery_box', FCP_POST_TYPE, 'normal', 'default');
});

function fcp_render_details_box($post) {
    wp_nonce_field(FCP_NONCE_ACTION, FCP_NONCE_NAME);

    $city     = get_post_meta($post->ID, 'project_city', true);
    $city_key = get_post_meta($post->ID, 'project_city_key', true);
    $category = get_post_meta($post->ID, 'project_category', true);
    $usage    = get_post_meta($post->ID, 'project_usage', true);
    $badge    = get_post_meta($post->ID, 'project_badge', true);
    $area     = get_post_meta($post->ID, 'project_area', true);
    ?>
    <style>
        .fcp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; direction: rtl; }
        .fcp-field { margin-bottom: 16px; }
        .fcp-field label { display: block; font-weight: 600; margin-bottom: 5px; }
        .fcp-field input[type=text],
        .fcp-field input[type=number],
        .fcp-field select { width: 100%; max-width: 420px; }
        @media (max-width: 782px) { .fcp-grid { grid-template-columns: 1fr; } }
    </style>
    <div class="fcp-grid">
        <div class="fcp-field">
            <label for="fcp_city">آدرس / موقعیت دقیق پروژه</label>
            <input type="text" id="fcp_city" name="fcp_city" value="<?php echo esc_attr($city); ?>" placeholder="مثلاً: تهران، شهرک صنعتی شهاب">
        </div>
        <div class="fcp-field">
            <label for="fcp_city_key">شهر (برای فیلتر سایت)</label>
            <input type="text" id="fcp_city_key" name="fcp_city_key" value="<?php echo esc_attr($city_key); ?>" placeholder="مثلاً: تهران">
        </div>
        <div class="fcp-field">
            <label for="fcp_category">دسته‌بندی پروژه</label>
            <select id="fcp_category" name="fcp_category">
                <option value="">— انتخاب کنید —</option>
                <?php foreach (fcp_categories() as $key => $label) : ?>
                    <option value="<?php echo esc_attr($key); ?>" <?php selected($category, $key); ?>><?php echo esc_html($label); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="fcp-field">
            <label for="fcp_usage">نوع کاربری</label>
            <select id="fcp_usage" name="fcp_usage">
                <option value="">— انتخاب کنید —</option>
                <?php foreach (fcp_usages() as $key => $label) : ?>
                    <option value="<?php echo esc_attr($key); ?>" <?php selected($usage, $key); ?>><?php echo esc_html($label); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="fcp-field">
            <label for="fcp_badge">برچسب نمایشی (روی کارت پروژه)</label>
            <input type="text" id="fcp_badge" name="fcp_badge" value="<?php echo esc_attr($badge); ?>" placeholder="مثلاً: زمین ورزشی">
        </div>
        <div class="fcp-field">
            <label for="fcp_area">متراژ (متر مربع)</label>
            <input type="number" id="fcp_area" name="fcp_area" min="0" step="1" value="<?php echo esc_attr($area); ?>">
        </div>
    </div>
    <?php
}

function fcp_render_gallery_box($post) {
    $gallery = get_post_meta($post->ID, 'project_gallery', true);
    $gallery = is_array($gallery) ? $gallery : [];
    ?>
    <div dir="rtl">
        <p>چند تصویر از پروژه انتخاب کنید تا در صفحه‌ی اختصاصی پروژه به شکل گالری نمایش داده شوند (جدا از تصویر اصلی).</p>
        <input type="hidden" id="fcp_gallery_input" name="fcp_gallery" value="<?php echo esc_attr(implode(',', $gallery)); ?>">
        <div id="fcp_gallery_preview" style="display:flex;flex-wrap:wrap;gap:10px;margin:12px 0;">
            <?php foreach ($gallery as $url) : ?>
                <img src="<?php echo esc_url($url); ?>" style="width:100px;height:100px;object-fit:cover;border-radius:8px;">
            <?php endforeach; ?>
        </div>
        <button type="button" class="button" id="fcp_gallery_button">انتخاب / ویرایش تصاویر گالری</button>
    </div>
    <script>
    (function () {
        var frame;
        var button = document.getElementById('fcp_gallery_button');
        if (!button) return;
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (frame) { frame.open(); return; }
            frame = wp.media({
                title: 'انتخاب تصاویر گالری پروژه',
                button: { text: 'استفاده از این تصاویر' },
                multiple: true,
            });
            frame.on('select', function () {
                var selection = frame.state().get('selection');
                var urls = [];
                var preview = document.getElementById('fcp_gallery_preview');
                preview.innerHTML = '';
                selection.each(function (attachment) {
                    var url = attachment.attributes.url;
                    urls.push(url);
                    var img = document.createElement('img');
                    img.src = url;
                    img.style.cssText = 'width:100px;height:100px;object-fit:cover;border-radius:8px;';
                    preview.appendChild(img);
                });
                document.getElementById('fcp_gallery_input').value = urls.join(',');
            });
            frame.open();
        });
    })();
    </script>
    <?php
}

add_action('admin_enqueue_scripts', function ($hook) {
    global $post_type;
    if (in_array($hook, ['post.php', 'post-new.php'], true) && $post_type === FCP_POST_TYPE) {
        wp_enqueue_media();
    }
});

/* =========================================================
 * ۴) ذخیره‌سازی مقادیر فیلدها هنگام ثبت/به‌روزرسانی پروژه
 * ========================================================= */
add_action('save_post_' . FCP_POST_TYPE, function ($post_id) {
    if (!isset($_POST[FCP_NONCE_NAME]) || !wp_verify_nonce($_POST[FCP_NONCE_NAME], FCP_NONCE_ACTION)) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['fcp_city'])) {
        update_post_meta($post_id, 'project_city', sanitize_text_field($_POST['fcp_city']));
    }
    if (isset($_POST['fcp_city_key'])) {
        update_post_meta($post_id, 'project_city_key', sanitize_text_field($_POST['fcp_city_key']));
    }
    if (isset($_POST['fcp_category'])) {
        $value = array_key_exists($_POST['fcp_category'], fcp_categories()) ? $_POST['fcp_category'] : '';
        update_post_meta($post_id, 'project_category', sanitize_text_field($value));
    }
    if (isset($_POST['fcp_usage'])) {
        $value = array_key_exists($_POST['fcp_usage'], fcp_usages()) ? $_POST['fcp_usage'] : '';
        update_post_meta($post_id, 'project_usage', sanitize_text_field($value));
    }
    if (isset($_POST['fcp_badge'])) {
        update_post_meta($post_id, 'project_badge', sanitize_text_field($_POST['fcp_badge']));
    }
    if (isset($_POST['fcp_area'])) {
        update_post_meta($post_id, 'project_area', absint($_POST['fcp_area']));
    }
    if (isset($_POST['fcp_gallery'])) {
        $urls = array_filter(array_map('trim', explode(',', $_POST['fcp_gallery'])));
        update_post_meta($post_id, 'project_gallery', array_values(array_map('esc_url_raw', $urls)));
    }
});

/* =========================================================
 * ۵) ستون‌های اضافه در جدول «همه‌ی پروژه‌ها» برای دید سریع‌تر
 * ========================================================= */
add_filter('manage_' . FCP_POST_TYPE . '_posts_columns', function ($columns) {
    $columns['project_city']     = 'شهر';
    $columns['project_category'] = 'دسته‌بندی';
    $columns['project_area']     = 'متراژ';
    return $columns;
});

add_action('manage_' . FCP_POST_TYPE . '_posts_custom_column', function ($column, $post_id) {
    switch ($column) {
        case 'project_city':
            echo esc_html(get_post_meta($post_id, 'project_city_key', true) ?: '—');
            break;
        case 'project_category':
            $cats = fcp_categories();
            $key  = get_post_meta($post_id, 'project_category', true);
            echo esc_html($cats[$key] ?? '—');
            break;
        case 'project_area':
            $area = (int) get_post_meta($post_id, 'project_area', true);
            echo $area ? esc_html(number_format_i18n($area)) . ' متر مربع' : '—';
            break;
    }
}, 10, 2);
