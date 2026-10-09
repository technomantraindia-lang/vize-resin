<?php

return [
    /**
     * 1. Dashboard.
     */
    [
        'key'        => 'dashboard',
        'name'       => 'admin::app.components.layouts.sidebar.dashboard',
        'route'      => 'admin.dashboard.index',
        'sort'       => 1,
        'icon'       => 'icon-dashboard',
    ],

    /**
     * 2. VIZE Resin Products Catalog.
     */
    [
        'key'        => 'vize_resins',
        'name'       => 'Resin Products',
        'route'      => 'admin.vize.resins.index',
        'sort'       => 2,
        'icon'       => 'icon-product',
    ],

    /**
     * 3. VIZE Colors & Pigments Manager.
     */
    [
        'key'        => 'vize_pigments',
        'name'       => 'Colors & Pigments',
        'route'      => 'admin.vize.pigments.index',
        'sort'       => 3,
        'icon'       => 'icon-attribute',
    ],

    /**
     * 4. VIZE Table Tops Studio.
     */
    [
        'key'        => 'vize_table_tops',
        'name'       => 'Table Tops Studio',
        'route'      => 'admin.vize.table_tops.index',
        'sort'       => 4,
        'icon'       => 'icon-product',
    ],

    /**
     * 5. VIZE Workshops, Masterclasses & Batches.
     */
    [
        'key'        => 'vize_workshops',
        'name'       => 'Workshops & Batches',
        'route'      => 'admin.vize.workshops.index',
        'sort'       => 5,
        'icon'       => 'icon-customer',
    ],

    /**
     * 6. VIZE Video & Reels Hub.
     */
    [
        'key'        => 'vize_videos',
        'name'       => 'Video & Reels Hub',
        'route'      => 'admin.vize.videos.index',
        'sort'       => 6,
        'icon'       => 'icon-attachment',
    ],

    /**
     * 7. VIZE Bento Showcase Gallery.
     */
    [
        'key'        => 'vize_showcase',
        'name'       => 'Bento Showcase Gallery',
        'route'      => 'admin.vize.showcase.index',
        'sort'       => 7,
        'icon'       => 'icon-store',
    ],

    /**
     * 8. VIZE Site Offers & Popup Manager.
     */
    [
        'key'        => 'vize_offers',
        'name'       => 'Offers & Popups',
        'route'      => 'admin.vize.offers.index',
        'sort'       => 8,
        'icon'       => 'icon-promotion',
    ],

    /**
     * 9. Customers & Leads CRM Hub.
     */
    [
        'key'        => 'customers',
        'name'       => 'Customers & Leads CRM',
        'route'      => 'admin.vize.customers.index',
        'sort'       => 9,
        'icon'       => 'icon-customer-2',
    ],

    /**
     * 10. Analytics & Reports.
     */
    [
        'key'        => 'reporting',
        'name'       => 'Analytics & Reports',
        'route'      => 'admin.reporting.sales.index',
        'sort'       => 10,
        'icon'       => 'icon-report',
        'icon-class' => 'report-icon',
    ], [
        'key'        => 'reporting.sales',
        'name'       => 'Sales & Revenue Reports',
        'route'      => 'admin.reporting.sales.index',
        'sort'       => 1,
        'icon'       => '',
    ], [
        'key'        => 'reporting.products',
        'name'       => 'Product Performance',
        'route'      => 'admin.reporting.products.index',
        'sort'       => 2,
        'icon'       => '',
    ], [
        'key'        => 'reporting.customers',
        'name'       => 'Customer Insights',
        'route'      => 'admin.reporting.customers.index',
        'sort'       => 3,
        'icon'       => '',
    ],

    /**
     * 11. Settings (Cleaned & Essential Only).
     */
    [
        'key'        => 'settings',
        'name'       => 'admin::app.components.layouts.sidebar.settings',
        'route'      => 'admin.settings.users.index',
        'sort'       => 11,
        'icon'       => 'icon-settings',
        'icon-class' => 'settings-icon',
    ], [
        'key'        => 'settings.users',
        'name'       => 'Admin Users & Staff',
        'route'      => 'admin.settings.users.index',
        'sort'       => 1,
        'icon'       => '',
    ], [
        'key'        => 'settings.roles',
        'name'       => 'Staff Roles & Permissions',
        'route'      => 'admin.settings.roles.index',
        'sort'       => 2,
        'icon'       => '',
    ], [
        'key'        => 'settings.taxes',
        'name'       => 'GST Tax Categories',
        'route'      => 'admin.settings.taxes.categories.index',
        'sort'       => 3,
        'icon'       => '',
    ], [
        'key'        => 'settings.taxes_rates',
        'name'       => 'GST Tax Rates (18%, 12%, 5%)',
        'route'      => 'admin.settings.taxes.rates.index',
        'sort'       => 4,
        'icon'       => '',
    ], [
        'key'        => 'settings.inventory_sources',
        'name'       => 'Warehouse & Stock Locations',
        'route'      => 'admin.settings.inventory_sources.index',
        'sort'       => 5,
        'icon'       => '',
    ], [
        'key'        => 'settings.channels',
        'name'       => 'Sales Channels & Storefront',
        'route'      => 'admin.settings.channels.index',
        'sort'       => 6,
        'icon'       => '',
    ],

    /**
     * 12. System Configuration.
     */
    [
        'key'        => 'configuration',
        'name'       => 'admin::app.components.layouts.sidebar.configure',
        'route'      => 'admin.configuration.index',
        'sort'       => 12,
        'icon'       => 'icon-configuration',
    ],
];
