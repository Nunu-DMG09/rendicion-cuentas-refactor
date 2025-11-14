<?php
namespace App\Models;

use CodeIgniter\Model;

class PreguntaModel extends Model
{
    protected $table      = 'pregunta';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'contenido',
        'id_usuario',
        'id_eje',
        'fecha_registro'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'fecha_registro';
    protected $updatedField  = '';
    protected $deletedField  = '';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}