<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Catatan;
use Illuminate\Support\Facades\DB;

class CatatanController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $courses = Catatan::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', '%' . $request->search . '%');
            $q->orWhere('isi', 'LIKE', '%' . $request->search . '%');
        })->where('user_id', auth()->user()->id)->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($courses);
    }

    public function store(Request $request) {
        $request->validate([
            'nama' => 'required',
            'isi' => 'required'
        ]);

        $catatan = Catatan::create([
            'user_id' => auth()->user()->id,
            'nama' => $request->nama,
            'isi' => $request->isi
        ]);

        return response()->json([
            'message' => 'Catatan berhasil dibuat',
            'catatan' => $catatan
        ]);
    }

    public function get() {
        $catatan = Catatan::where('user_id', auth()->user()->id)->get();

        return response()->json([
            'catatan' => $catatan
        ]);
    }

    public function show($id) {
        $catatan = Catatan::with('siswas')->where('id', $id)->first();

        return response()->json([
            'catatan' => $catatan
        ]);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'nama' => 'required',
            'isi' => 'required'
        ]);

        $catatan = Catatan::find($id);
        $catatan->update([
            'nama' => $request->nama,
            'isi' => $request->isi
        ]);

        return response()->json([
            'message' => 'Catatan berhasil diupdate',
            'catatan' => $catatan
        ]);
    }

    public function destroy($id) {
        $catatan = Catatan::find($id);
        $catatan->delete();

        return response()->json([
            'message' => 'Catatan berhasil dihapus'
        ]);
    }
}
