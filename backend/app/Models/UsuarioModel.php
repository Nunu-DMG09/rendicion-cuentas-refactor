<?php
namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $table      = 'usuario';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'nombre',
        'sexo',
        'tipo_participacion',
        'titulo',
        'ruc_empresa',
        'nombre_empresa',
        'dni',
        'id_rendicion',
        'asistencia'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = '';
    protected $updatedField  = '';
    protected $deletedField  = '';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}