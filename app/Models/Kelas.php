<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model {
    protected $fillable = ['user_id', 'nama', 'kode'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function siswas() {
        return $this->belongsToMany(User::class, 'kelas_siswas', 'kelas_id', 'siswa_id');
    }
}
