<?php

function academy(){
    add_action( 'init', 'md_custom_post_type' );
    function md_custom_post_type() {
        $custom_posts_type = array();

        $custom_posts_type[] = array(
            'name'      => 'course',
            'title'     => 'Corsi',
            'slug'      => 'course',
            'supports'  => array(
                'title',
                'page-attributes'
            ),
            'exclude_from_search' => false,
            'public' => true,
            'publicly_queryable' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'course',
            'graphql_plural_name' => 'courses'
        );

        foreach($custom_posts_type as $cpt){
            extract($cpt);

            register_post_type( $name, array(
                'labels'                => array(
                    'name'                  => $title,
                    'singular_name'         => sprintf(esc_html__('%s Post', 'md'), $title),
                    'all_items'             => sprintf(esc_html__('All %', 'md'), $title),
                    'add_new'               => __('Add New', 'md'),
                    'add_new_item'          => sprintf(esc_html__('Add New %', 'md'), $title),
                    'edit'                  => __('Edit', 'md'),
                    'edit_item'             => sprintf(esc_html__('Edit %', 'md'), $title),
                    'new_item'              => sprintf(esc_html__('New %', 'md'), $title),
                    'view_item'             => sprintf(esc_html__('View %', 'md'), $title),
                    'search_items'          => sprintf(esc_html__('Search %', 'md'), $title),
                    'not_found'             => esc_html__('Nothing found.', 'md'),
                    'not_found_in_trash'    => esc_html__('Nothung found in Trash.', 'md'),
                    'parent_item_colon'     => ''
                ),
                'public' => $public,
                'publicly_queryable' => $publicly_queryable,
                'exclude_from_search' => $exclude_from_search,
                'has_archive' => true,
                'capability_type' => 'post',
                'hierarchical' => true,
                'rewrite' => array(
                    'slug' => $slug,
                    'with_front' => false
                ),
                'supports' => $supports,
                'show_in_graphql' => $show_in_graphql,
                'graphql_single_name' => $graphql_single_name,
                'graphql_plural_name' => $graphql_plural_name
            ));
        }


        $taxonomies = array();

        foreach ($taxonomies as $tax){
            $cpt    = $tax['cpt'];
            $name   = $tax['name'];
            $title  = $tax['title'];
            $slug   = $tax['slug'];
            $show_ui = $tax['show-ui'];


            register_taxonomy(
                $name,
                $cpt,
                array(
                    'hierarchical'      => true,
                    'label'             => $title,
                    'query_var'         => true,
                    'show_ui'           => $show_ui,
                    'show_admin_column' => true,
                    'rewrite'           => array(
                        'slug'          => $slug,
                        'with_front'    => false
                    )
                )
            );
        }

    }

    function hide_metabox_all(){
        echo '<style>#acf-group_637c35716d9ae{display: none !important}</style>';
        echo '<style>#acf-group_637c3aa43dcaa{display: none !important}</style>';
    }

    function hide_metabox_course(){
        echo '<style>#acf-group_637c35716d9ae{display: none !important}</style>';
        echo '<style>#acf-group_637c3aa43dcaa{display: block !important}</style>';
    }

    function hide_metabox_unit(){
        echo '<style>#acf-group_637c3aa43dcaa{display: none !important}</style>';
        echo '<style>#acf-group_637c35716d9ae{display: block !important}</style>';

    }

    global $pagenow;
    if (( $pagenow == 'post.php') || (get_post_type() == 'course')) {
        global $post;

        $post = get_post($_GET['post']);

        if($post->post_parent){
            add_action('admin_head', 'hide_metabox_course');
        } else {
            add_action('admin_head', 'hide_metabox_unit');
        }
    }
    else if($pagenow == 'post-new.php'){
        add_action('admin_head', 'hide_metabox_all');
    }
}
academy();