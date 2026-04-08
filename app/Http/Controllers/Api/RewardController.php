<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::where('is_active', true)->get();
        return response()->json($rewards);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_required' => 'required|integer|min:0',
            'type' => 'required|in:discount_percent,discount_fixed,product,upgrade',
            'value' => 'required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $reward = Reward::create($data);

        return response()->json($reward, 201);
    }

    public function show(Reward $reward)
    {
        return response()->json($reward);
    }

    public function update(Request $request, Reward $reward)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'points_required' => 'sometimes|required|integer|min:0',
            'type' => 'sometimes|required|in:discount_percent,discount_fixed,product,upgrade',
            'value' => 'sometimes|required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $reward->update($data);

        return response()->json($reward);
    }

    public function destroy(Reward $reward)
    {
        $reward->delete();

        return response()->json(['message' => 'Reward deleted']);
    }
}