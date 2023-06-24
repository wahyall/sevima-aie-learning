<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth', 'guru'])->group(function () {
    Route::inertia('/', 'kelas/Index');
    Route::get('/kelas/{kode}/materi', function ($kode) {
        return Inertia::render('kelas/materi/Index', [
            'kode' => $kode
        ]);
    });

    Route::get('/kelas/{kode}/materi/{materi}/tugas', function ($kode, $materi) {
        return Inertia::render('guru/materi/tugas/Index', [
            'kode' => $kode,
            'materi' => $materi
        ]);
    });
});

Route::middleware(['auth', 'siswa'])->group(function () {
    Route::inertia('/siswa', 'siswa/Index');
    Route::get('/siswa/kelas/{kode}', function ($kode) {
        return Inertia::render('siswa/kelas/Index', [
            'kode' => $kode
        ]);
    });
    Route::get('/siswa/kelas/{kode}/materi/{materi}', function ($kode, $materi) {
        return Inertia::render('siswa/kelas/materi/Index', [
            'kode' => $kode,
            'materi' => $materi
        ]);
    });
});

Route::inertia('/catatan', 'catatan/Index')->middleware(['auth']);

require __DIR__ . '/auth.php';
