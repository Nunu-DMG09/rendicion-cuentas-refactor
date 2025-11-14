<?php
namespace App\Models;

use CodeIgniter\Model;

class HistorialAdminModel extends Model
{
    protected $table      = 'historial_admin';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'id_admin',
        'accion',
        'motivo',
        'realizado_por',
        'fecha_accion'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'fecha_accion';
    protected $updatedField  = '';
    protected $deletedField  = '';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}