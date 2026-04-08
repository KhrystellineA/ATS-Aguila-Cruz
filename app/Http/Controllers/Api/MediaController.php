<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section' => 'required|string|max:50',
            'image' => 'required|image|max:5120', // 5MB max
            'alt_text' => 'nullable|string',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $path = $request->file('image')->store('media', 'public');

        $media = MediaItem::create([
            'section' => $request->section,
            'file_path' => $path,
            'alt_text' => $request->alt_text ?? '',
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json($media, 201);
    }

    public function getBySection(string $section)
    {
        $items = MediaItem::where('section', $section)
            ->orderBy('sort_order')
            ->get()
            ->map(function($m) {
                return [
                    ...$m->toArray(),
                    'url' => asset('storage/'.$m->file_path),
                ];
            });

        return response()->json($items);
    }

    public function destroy(MediaItem $media)
    {
        // Delete the file from storage
        Storage::disk('public')->delete($media->file_path);

        // Delete the database record
        $media->delete();

        return response()->json(['message' => 'Media deleted']);
    }
}