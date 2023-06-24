<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kelas;
use Illuminate\Support\Facades\DB;

class KelasController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Kelas::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('kode', 'LIKE', '%' . $request->search . '%');
        })->where('user_id', auth()->user()->id)->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function store(Request $request) {
        $request->validate([
            'nama' => 'required',
        ]);

        $kode = strtoupper(substr($request->nama, 0, 3) . substr(md5(time()), 0, 6));

        $kelas = Kelas::create([
            'user_id' => auth()->user()->id,
            'nama' => $request->nama,
            'kode' => $kode
        ]);

        return response()->json([
            'message' => 'Kelas berhasil dibuat',
            'kelas' => $kelas
        ]);
    }

    public function get() {
        $kelas = Kelas::where('user_id', auth()->user()->id)->get();

        return response()->json([
            'kelas' => $kelas
        ]);
    }

    public function show($kode) {
        $kelas = Kelas::with('siswas')->where('kode', $kode)->first();

        return response()->json([
            'kelas' => $kelas
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'nama' => 'required',
        ]);

        $kelas = Kelas::find($id);
        $kelas->update([
            'nama' => $request->nama,
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
}
