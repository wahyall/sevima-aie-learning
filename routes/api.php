<?php

use App\Http\Controllers\GPTController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\SiswaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatatanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth'])->group(function () {
    // Route::get("user", [AuthenticatedSessionController::class, 'user']);
    Route::post("chat", [GPTController::class, 'chat']);

    Route::prefix('kelas')->group(function () {
        Route::post('paginate', [KelasController::class, 'paginate']);
        Route::get('', [KelasController::class, 'get']);
        Route::post('', [KelasController::class, 'store']);
        Route::get('{kode}', [KelasController::class, 'show']);
        Route::post('{id}', [KelasController::class, 'update']);
        Route::delete('{id}', [KelasController::class, 'destroy']);

        Route::prefix('{kode}/materi')->group(function () {
            Route::post('', [MateriController::class, 'store']);
            Route::post('paginate', [MateriController::class, 'paginate']);
            Route::post('{materi}/tugas', [MateriController::class, 'tugas']);
        });
    });

    Route::prefix('materi')->group(function () {
        Route::get('{id}', [MateriController::class, 'show']);
        Route::post('{id}', [MateriController::class, 'update']);
        Route::delete('{id}', [MateriController::class, 'destroy']);
    });

    Route::prefix('siswa')->group(function () {
        Route::post('kelas', [SiswaController::class, 'kelas']);
        Route::post('kelas/{kode}/materi', [SiswaController::class, 'listMateri']);
        Route::get('kelas/{kode}/materi/{materi}', [SiswaController::class, 'materi']);
        Route::post('kelas/{kode}/materi/{materi}/tugas', [SiswaController::class, 'submitTugas']);
        Route::get('kelas/{kode}/join', [SiswaController::class, 'join']);
        Route::get('kelas/{kode}/leave', [SiswaController::class, 'leave']);
    });

    Route::prefix('catatan')->group(function () {
        Route::post('paginate', [CatatanController::class, 'paginate']);
        Route::get('', [CatatanController::class, 'get']);
        Route::post('', [CatatanController::class, 'store']);
        Route::get('{id}', [CatatanController::class, 'show']);
        Route::post('{id}', [CatatanController::class, 'update']);
        Route::delete('{id}', [CatatanController::class, 'destroy']);
    });
});
