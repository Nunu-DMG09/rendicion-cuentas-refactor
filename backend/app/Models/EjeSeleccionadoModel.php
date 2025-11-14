<?php
namespace App\Models;

use CodeIgniter\Model;

class EjeSeleccionadoModel extends Model
{
    protected $table      = 'eje_seleccionado';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'id_rendicion',
        'id_eje',
        'cantidad_pregunta'
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