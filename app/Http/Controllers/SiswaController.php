<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kelas;
use App\Models\Materi;
use Illuminate\Support\Facades\DB;
use App\Models\PengumpulanTugas;

class SiswaController extends Controller {
    public function kelas(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Kelas::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('kode', 'LIKE', '%' . $request->search . '%');
        })->whereHas('siswas', function ($q) {
            $q->where('users.id', auth()->user()->id);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function listMateri(Request $request, $kode) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Materi::where(function ($q) use ($request) {
            $q->where('judul', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('tipe', 'LIKE', '%' . $request->search . '%');
        })->whereHas('kelas', function ($q) use ($kode) {
            $q->where('kode', $kode);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function materi($kode, $materi) {
        $materi = Materi::find($materi);

        if (!$materi) {
            return response()->json([
                'message' => 'Materi tidak ditemukan'
            ], 404);
        }

        return response()->json($materi);
    }

    public function join($kode) {
        $kelas = Kelas::where('kode', $kode)->first();

        if (!$kelas) {
            return response()->json([
                'message' => 'Kelas tidak ditemukan'
            ], 404);
        }

        $kelas->siswas()->attach(auth()->user()->id);

        return response()->json([
            'message' => 'Kelas berhasil diikuti'
        ]);
    }

    public function leave($kode) {
        $kelas = Kelas::where('kode', $kode)->first();
        $kelas->siswas()->detach(auth()->user()->id);

        return response()->json([
            'message' => 'Kelas berhasil ditinggalkan'
        ]);
    }

    public function submitTugas(Request $request, $kode, $materi) {
        $request->validate([
            'file' => 'required:file'
        ]);

        $file = 'storage/' . $request->file('file')->store('tugas', 'public');
        PengumpulanTugas::create([
            'materi_id' => $materi,
            'user_id' => auth()->user()->id,
            'file' => $file
        ]);

        return response()->json([
            'message' => 'Tugas berhasil dikumpulkan'
        ]);
    }
}
