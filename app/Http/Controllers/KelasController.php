<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kelas;
use Illuminate\Support\Facades\DB;

class KelasController extends Controller {
    public function index() {
        Inertia::render("kelas/Index");
    }

    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Kelas::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('kode', 'LIKE', '%' . $request->search . '%');
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function store(Request $request) {
        $request->validate([
            'nama' => 'required',
            'kode' => 'required'
        ]);

        $kelas = Kelas::create([
            'user_id' => auth()->user()->id,
            'nama' => $request->nama,
            'kode' => $request->kode
        ]);

        return response()->json([
            'message' => 'Kelas berhasil dibuat',
            'kelas' => $kelas
        ]);
    }

    public function show($id) {
        $kelas = Kelas::with('siswas')->find($id);

        return response()->json([
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'nama' => 'required',
            'kode' => 'required'
        ]);

        $kelas = Kelas::find($id);
        $kelas->update([
            'nama' => $request->nama,
            'kode' => $request->kode
        ]);

        return response()->json([
            'message' => 'Kelas berhasil diupdate',
            'kelas' => $kelas
        ]);
    }

    public function destroy($id) {
        $kelas = Kelas::find($id);
        $kelas->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus'
        ]);
    }

    public function join(Request $request) {
        $request->validate([
            'kode' => 'required'
        ]);

        $kelas = Kelas::where('kode', $request->kode)->first();

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

    public function leave($id) {
        $kelas = Kelas::find($id);
        $kelas->siswas()->detach(auth()->user()->id);

        return response()->json([
            'message' => 'Kelas berhasil ditinggalkan'
        ]);
    }
}
