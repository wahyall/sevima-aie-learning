<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materi;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Kelas;
use App\Models\PengumpulanTugas;

class MateriController extends Controller {
    public function index() {
        Inertia::render("materi/Index");
    }

    public function paginate(Request $request, $kode) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Materi::with(['kelas'])->where(function ($q) use ($request) {
            $q->where('judul', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('tipe', 'LIKE', '%' . $request->search . '%');
            $q->orWhereHas('kelas', function ($q) use ($request) {
                $q->where('tipe', 'LIKE', '%' . $request->search . '%');
            });
        })->whereHas('kelas', function ($q) use ($kode) {
            $q->where('kode', $kode);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function store(Request $request, $kode) {
        $request->validate([
            'judul' => 'required',
            'konten' => 'required',
            'file' => 'nullable:file',
            'tipe' => 'required:in:materi,tugas',
        ]);

        $kelas = Kelas::where('kode', $kode)->first();
        $data = $request->only(['judul', 'konten', 'tipe']);
        $data['kelas_id'] = $kelas->id;
        if ($request->hasFile('file')) {
            $data['file'] = 'storage/' . $request->file('file')->store('materi', 'public');
        }

        $materi = Materi::create($data);

        return response()->json([
            'message' => 'Materi berhasil dibuat',
            'materi' => $materi
        ]);
    }

    public function show($id) {
        $materi = Materi::find($id);

        return response()->json([
            'materi' => $materi
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'judul' => 'required',
            'konten' => 'required',
            'file' => 'nullable:file',
            'tipe' => 'required:in:materi,tugas',
        ]);

        $data = $request->only(['judul', 'konten', 'tipe']);
        if ($request->hasFile('file')) {
            $data['file'] = 'storage/' . $request->file('file')->store('materi', 'public');
        }

        $materi = Materi::find($id);
        $materi->update($data);

        return response()->json([
            'message' => 'Materi berhasil diupdate',
            'materi' => $materi
        ]);
    }

    public function destroy($id) {
        $materi = Materi::find($id);
        $materi->delete();

        return response()->json([
            'message' => 'Materi berhasil dihapus'
        ]);
    }

    public function tugas(Request $request, $kode, $materi) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = PengumpulanTugas::with(['user'])->where(function ($q) use ($request) {
            $q->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%');
            });
        })->where('materi_id', $materi)->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }
}
