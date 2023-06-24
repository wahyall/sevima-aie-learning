<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi extends Model {
    protected $fillable = ['kelas_id', 'judul', 'konten', 'file', 'tipe'];

    public function kelas() {
        return $this->belongsTo(Kelas::class);
    }
}
