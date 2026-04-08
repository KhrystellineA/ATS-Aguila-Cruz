<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\RedemptionController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\MediaController;

// Public routes (no auth required)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/public/search', [PublicController::class, 'search']);
Route::post('/public/redeem', [PublicController::class, 'requestRedemption']);
Route::get('/public/rewards', [PublicController::class, 'listRewards']);
Route::post('/public/code-request', [PublicController::class, 'requestCodeChange']);
Route::get('/public/media/{section}', [PublicController::class, 'getMedia']);

// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/admin/dashboard', [ClientController::class, 'dashboardStats']);

    Route::apiResource('clients', ClientController::class);
    Route::post('/clients/{client}/adjust-points', [ClientController::class, 'adjustPoints']);
    Route::post('/clients/{client}/approve-code-change', [ClientController::class, 'approveCodeChange']);
    Route::post('/clients/{client}/reject-code-change', [ClientController::class, 'rejectCodeChange']);

    Route::apiResource('referrals', ReferralController::class);
    Route::apiResource('rewards', RewardController::class);
    Route::apiResource('redemptions', RedemptionController::class);
    Route::patch('/redemptions/{redemption}/approve', [RedemptionController::class, 'approve']);
    Route::patch('/redemptions/{redemption}/reject', [RedemptionController::class, 'reject']);
    Route::patch('/redemptions/{redemption}/used', [RedemptionController::class, 'markUsed']);

    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);
    Route::get('/audit-logs', [SettingsController::class, 'auditLogs']);

    Route::post('/media', [MediaController::class, 'upload']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);
    Route::get('/media/{section}', [MediaController::class, 'getBySection']);
});