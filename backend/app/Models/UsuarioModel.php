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
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'nombre' => 'required|string|max_length[60]',
        'sexo'   => 'required|in_list[M,F]',
        'tipo_participacion' => 'required|in_list[asistente,orador]',
        'titulo' => 'permit_empty|in_list[PERSONAL,ORGANIZACION]',
        'ruc_empresa' => 'permit_empty|numeric|max_length[11]',
        'nombre_empresa' => 'permit_empty|string|max_length[100]',
        'dni' => 'permit_empty|alpha_numeric|max_length[12]',
        'id_rendicion' => 'permit_empty|integer',
        'asistencia' => 'required|in_list[si,no]'
    ];

    protected $validationMessages = [
        'nombre' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'sexo' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} debe ser M o F.'
        ],
        'tipo_participacion' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} no es válido.'
        ],
        'ruc_empresa' => [
            'numeric' => 'El campo {field} debe ser numérico.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'asistencia' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} debe ser si o no.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}