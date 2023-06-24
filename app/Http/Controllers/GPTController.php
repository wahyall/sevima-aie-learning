<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GPTController extends Controller {
    public function chat(Request $request) {
        $request->validate([
            'message' => 'required|string'
        ]);

        $message = $request->message;
        $api_key = env("GPT_KEY");
        $response = Http::accept('application/json')->withToken($api_key)->post("https://api.pawan.krd/v1/completions", [
            "model" => "gpt-3.5-turbo",
            "prompt" => "Human: $message\\nAI:",
            "temperature" => 0.7,
            "max_tokens" => 256,
            "stop" => [
                "Human:",
                "AI:"
            ]
        ]);

        // return to client
        return response()->json([
            'message' => $response->json()['choices'][0]['text'],
            'type' => "ai"
        ]);
    }
}
