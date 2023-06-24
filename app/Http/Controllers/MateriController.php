<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Materi;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MateriController extends Controller {
    public function index() {
        Inertia::render("materi/Index");
    }

    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Materi::where(function ($q) use ($request) {
            $q->where('judul', 'LIKE', '%' . $request->search . '%');
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function store(Request $request) {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'judul' => 'required',
            'konten' => 'required',
            'file' => 'nullable:file',
            'tipe' => 'required:in:materi,tugas',
        ]);

        $data = $request->only(['judul', 'konten', 'tipe']);
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
            'kelas_id' => 'required|exists:kelas,id',
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
}
