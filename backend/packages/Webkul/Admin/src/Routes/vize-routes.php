<?php

use Illuminate\Support\Facades\Route;
use Webkul\Admin\Http\Controllers\VizeVideoController;
use Webkul\Admin\Http\Controllers\VizeTableTopController;
use Webkul\Admin\Http\Controllers\VizeWorkshopController;
use Webkul\Admin\Http\Controllers\VizePigmentController;
use Webkul\Admin\Http\Controllers\VizeShowcaseController;
use Webkul\Admin\Http\Controllers\VizeResinController;
use Webkul\Admin\Http\Controllers\VizeCustomerController;
use Webkul\Admin\Http\Controllers\VizeOfferController;

Route::prefix('vize')->name('admin.vize.')->group(function () {
    
    // 0. Resins & Products Catalog Hub
    Route::get('resins', [VizeResinController::class, 'index'])->name('resins.index');
    Route::post('resins', [VizeResinController::class, 'store'])->name('resins.store');
    Route::post('resins/categories', [VizeResinController::class, 'storeCategory'])->name('resins.categories.store');
    Route::post('resins/{id}', [VizeResinController::class, 'update'])->name('resins.update');
    Route::post('resins/{id}/stock', [VizeResinController::class, 'updateStock'])->name('resins.stock');
    Route::post('resins/{id}/update-stock', [VizeResinController::class, 'updateStock'])->name('resins.update_stock');
    Route::match(['post', 'delete'], 'resins/{id}/delete', [VizeResinController::class, 'destroy'])->name('resins.delete');
    Route::match(['post', 'delete'], 'resins/{id}', [VizeResinController::class, 'destroy'])->name('resins.destroy');

    // 1. Video & Reels Hub
    Route::get('videos', [VizeVideoController::class, 'index'])->name('videos.index');
    Route::post('videos', [VizeVideoController::class, 'store'])->name('videos.store');
    Route::post('videos/{id}', [VizeVideoController::class, 'update'])->name('videos.update');
    Route::post('videos/{id}/status', [VizeVideoController::class, 'toggleStatus'])->name('videos.toggle_status');
    Route::match(['post', 'delete'], 'videos/{id}/delete', [VizeVideoController::class, 'destroy'])->name('videos.delete');
    Route::match(['post', 'delete'], 'videos/{id}', [VizeVideoController::class, 'destroy'])->name('videos.destroy');

    // 2. Table Tops Studio & Leads
    Route::get('table-tops', [VizeTableTopController::class, 'index'])->name('table_tops.index');
    Route::post('table-tops', [VizeTableTopController::class, 'store'])->name('table_tops.store');
    Route::post('table-tops/{id}', [VizeTableTopController::class, 'update'])->name('table_tops.update');
    Route::post('table-tops/{id}/status', [VizeTableTopController::class, 'updateStatus'])->name('table_tops.update_status');
    Route::match(['post', 'delete'], 'table-tops/{id}', [VizeTableTopController::class, 'destroy'])->name('table_tops.destroy');
    Route::match(['post', 'delete'], 'table-tops/{id}/delete', [VizeTableTopController::class, 'destroy'])->name('table_tops.delete');
    Route::post('table-tops/inquiries/{id}/status', [VizeTableTopController::class, 'updateInquiryStatus'])->name('table_tops.inquiries.update_status');
    Route::match(['post', 'delete'], 'table-tops/inquiries/{id}', [VizeTableTopController::class, 'destroyInquiry'])->name('table_tops.inquiries.destroy');
    Route::match(['post', 'delete'], 'table-tops/inquiries/{id}/delete', [VizeTableTopController::class, 'destroyInquiry'])->name('table_tops.inquiries.delete');

    // 3. Colors & Pigments Manager
    Route::get('pigments', [VizePigmentController::class, 'index'])->name('pigments.index');
    Route::post('pigments/categories', [VizePigmentController::class, 'storeCategory'])->name('pigments.categories.store');
    Route::post('pigments/categories/{id}', [VizePigmentController::class, 'updateCategory'])->name('pigments.categories.update');
    Route::match(['post', 'delete'], 'pigments/categories/{id}/delete', [VizePigmentController::class, 'destroyCategory'])->name('pigments.categories.destroy');
    Route::match(['post', 'delete'], 'pigments/categories/{id}', [VizePigmentController::class, 'destroyCategory'])->name('pigments.categories.delete');
    Route::post('pigments/shades', [VizePigmentController::class, 'storeShade'])->name('pigments.shades.store');
    Route::post('pigments/shades/{id}', [VizePigmentController::class, 'updateShade'])->name('pigments.shades.update');
    Route::match(['post', 'delete'], 'pigments/shades/{id}/delete', [VizePigmentController::class, 'destroyShade'])->name('pigments.shades.destroy');
    Route::match(['post', 'delete'], 'pigments/shades/{id}', [VizePigmentController::class, 'destroyShade'])->name('pigments.shades.delete');
    Route::post('pigments/{id}/stock', [VizePigmentController::class, 'updateStock'])->name('pigments.update_stock');
    Route::post('pigments', [VizePigmentController::class, 'storeShade'])->name('pigments.store');
    Route::match(['post', 'delete'], 'pigments/{id}', [VizePigmentController::class, 'destroyShade'])->name('pigments.destroy');

    // 4. Workshops, Courses & Batches
    Route::get('workshops', [VizeWorkshopController::class, 'index'])->name('workshops.index');
    Route::post('workshops/courses', [VizeWorkshopController::class, 'storeCourse'])->name('workshops.courses.store');
    Route::post('workshops/courses/{id}', [VizeWorkshopController::class, 'updateCourse'])->name('workshops.courses.update');
    Route::match(['post', 'delete'], 'workshops/courses/{id}/delete', [VizeWorkshopController::class, 'destroyCourse'])->name('workshops.courses.delete');
    Route::match(['post', 'delete'], 'workshops/courses/{id}', [VizeWorkshopController::class, 'destroyCourse'])->name('workshops.courses.destroy');
    Route::post('workshops/batches', [VizeWorkshopController::class, 'storeBatch'])->name('workshops.batches.store');
    Route::post('workshops/batches/{id}/status', [VizeWorkshopController::class, 'updateBatchStatus'])->name('workshops.batches.update_status');
    Route::match(['post', 'delete'], 'workshops/batches/{id}/delete', [VizeWorkshopController::class, 'destroyBatch'])->name('workshops.batches.delete');
    Route::match(['post', 'delete'], 'workshops/batches/{id}', [VizeWorkshopController::class, 'destroyBatch'])->name('workshops.batches.destroy');
    Route::post('workshops/admissions/{id}/status', [VizeWorkshopController::class, 'updateAdmissionStatus'])->name('workshops.admissions.update_status');
    Route::match(['post', 'delete'], 'workshops/admissions/{id}/delete', [VizeWorkshopController::class, 'destroyAdmission'])->name('workshops.admissions.delete');
    Route::match(['post', 'delete'], 'workshops/admissions/{id}', [VizeWorkshopController::class, 'destroyAdmission'])->name('workshops.admissions.destroy');
    Route::get('workshops/export-attendees/{batchId?}', [VizeWorkshopController::class, 'exportAttendees'])->name('workshops.export_attendees');

    // 5. Bento Showcase / Our Work Gallery
    Route::get('showcase', [VizeShowcaseController::class, 'index'])->name('showcase.index');
    Route::post('showcase', [VizeShowcaseController::class, 'store'])->name('showcase.store');
    Route::match(['post', 'delete'], 'showcase/{id}/delete', [VizeShowcaseController::class, 'destroy'])->name('showcase.delete');
    Route::match(['post', 'delete'], 'showcase/{id}', [VizeShowcaseController::class, 'destroy'])->name('showcase.destroy');
    Route::post('showcase/inquiries/{id}/status', [VizeShowcaseController::class, 'updateInquiryStatus'])->name('showcase.inquiries.update_status');
    Route::match(['post', 'delete'], 'showcase/inquiries/{id}/delete', [VizeShowcaseController::class, 'destroyInquiry'])->name('showcase.inquiries.delete');
    Route::match(['post', 'delete'], 'showcase/inquiries/{id}', [VizeShowcaseController::class, 'destroyInquiry'])->name('showcase.inquiries.destroy');

    // 6. Unified Customers & Leads CRM Hub
    Route::get('customers', [VizeCustomerController::class, 'index'])->name('customers.index');
    Route::post('customers', [VizeCustomerController::class, 'storeCustomer'])->name('customers.store');
    Route::post('customers/{id}', [VizeCustomerController::class, 'updateCustomer'])->name('customers.update');
    Route::match(['post', 'delete'], 'customers/{id}/delete', [VizeCustomerController::class, 'destroyCustomer'])->name('customers.delete');
    Route::match(['post', 'delete'], 'customers/{id}', [VizeCustomerController::class, 'destroyCustomer'])->name('customers.destroy');
    Route::get('customers-export', [VizeCustomerController::class, 'exportCustomers'])->name('customers.export');
    Route::post('customers/groups', [VizeCustomerController::class, 'storeGroup'])->name('customers.groups.store');
    Route::match(['post', 'delete'], 'customers/groups/{id}/delete', [VizeCustomerController::class, 'destroyGroup'])->name('customers.groups.delete');
    Route::match(['post', 'delete'], 'customers/groups/{id}', [VizeCustomerController::class, 'destroyGroup'])->name('customers.groups.destroy');
    Route::post('customers/reviews/{id}/status', [VizeCustomerController::class, 'updateReviewStatus'])->name('customers.reviews.update_status');
    Route::match(['post', 'delete'], 'customers/reviews/{id}/delete', [VizeCustomerController::class, 'destroyReview'])->name('customers.reviews.delete');
    Route::match(['post', 'delete'], 'customers/reviews/{id}', [VizeCustomerController::class, 'destroyReview'])->name('customers.reviews.destroy');
    Route::post('customers/inquiries/{id}/status', [VizeCustomerController::class, 'updateInquiryStatus'])->name('customers.inquiries.update_status');
    Route::match(['post', 'delete'], 'customers/inquiries/{id}/delete', [VizeCustomerController::class, 'destroyInquiry'])->name('customers.inquiries.delete');
    Route::match(['post', 'delete'], 'customers/inquiries/{id}', [VizeCustomerController::class, 'destroyInquiry'])->name('customers.inquiries.destroy');

    // 7. Site Offers & Popup Manager
    Route::get('offers', [VizeOfferController::class, 'index'])->name('offers.index');
    Route::post('offers', [VizeOfferController::class, 'store'])->name('offers.store');
    Route::post('offers/{id}/update', [VizeOfferController::class, 'update'])->name('offers.update');
    Route::post('offers/{id}', [VizeOfferController::class, 'update']);
    Route::put('offers/{id}', [VizeOfferController::class, 'update']);
    Route::post('offers/{id}/status', [VizeOfferController::class, 'toggleStatus'])->name('offers.toggle_status');
    Route::post('offers/{id}/delete', [VizeOfferController::class, 'destroy'])->name('offers.destroy');
    Route::delete('offers/{id}', [VizeOfferController::class, 'destroy']);
    Route::delete('offers/{id}/delete', [VizeOfferController::class, 'destroy'])->name('offers.delete');

});

