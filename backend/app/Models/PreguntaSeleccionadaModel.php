<?php
namespace App\Models;

use CodeIgniter\Model;

class PreguntaSeleccionadaModel extends Model
{
    protected $table      = 'pregunta_seleccionada';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'id_eje_seleccionado',
        'id_pregunta'
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