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

    // Dates & Soft Deletes
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'id_eje_seleccionado' => 'required|integer',
        'id_pregunta'         => 'required|integer'
    ];

    protected $validationMessages = [
        'id_eje_seleccionado' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'id_pregunta' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}