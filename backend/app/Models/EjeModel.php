<?php
namespace App\Models;

use CodeIgniter\Model;

class EjeModel extends Model
{
    protected $table      = 'eje';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'tematica',
        'estado',
    ];

    // Dates 
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation - estado ya no es obligatorio (la BD tiene default = 1)
    protected $validationRules = [
        'tematica' => 'required|string|max_length[120]',
        'estado'   => 'permit_empty|integer|in_list[0,1]'
    ];

    protected $validationMessages = [
        'tematica' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ]   
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}