<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catatan extends Model {
    protected $fillable = ['user_id', 'nama', 'isi'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
