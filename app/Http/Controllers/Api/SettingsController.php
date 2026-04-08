<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'expiration_days' => 'sometimes|required|integer|min:1',
            'notifications_enabled' => 'sometimes|required|boolean',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated']);
    }

    public function auditLogs()
    {
        $logs = \App\Models\AuditLog::with(['admin_user' => function($query) {
            $query->select('id', 'name', 'email');
        }])->orderBy('created_at', 'desc')->get();

        return response()->json($logs);
    }
}