<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengumpulanTugas extends Model {
    protected $fillable = ['materi_id', 'user_id', 'file'];
    protected $appends = ['waktu_pengumpulan'];

    public function getWaktuPengumpulanAttribute() {
        return $this->created_at->format('d M Y H:i');
    }

    public function materi() {
        return $this->belongsTo(Materi::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
