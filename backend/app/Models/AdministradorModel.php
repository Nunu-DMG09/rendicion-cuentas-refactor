<?php
namespace App\Models;

use CodeIgniter\Model;

class AdministradorModel extends Model
{
    protected $table      = 'administrador';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'dni',
        'nombre',
        'password',
        'categoria',
        'estado',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Dates 
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'dni'       => 'required|alpha_numeric|max_length[8]',
        'nombre'    => 'required|string|max_length[255]',
        // password will be hashed before insert/update; keep min length for raw password checks
        'password'  => 'required|string|min_length[8]',
        'categoria' => 'required|in_list[admin,super_admin]',
        'estado'    => 'required|integer|in_list[0,1]'
    ];

    protected $validationMessages = [
        'dni' => [
            'required' => 'El campo {field} es obligatorio.',
            'alpha_numeric' => 'El campo {field} sólo puede contener números y letras.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'nombre' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'password' => [
            'required' => 'El campo {field} es obligatorio.',
            'min_length' => 'El campo {field} debe tener al menos {param} caracteres.'
        ],
        'categoria' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list'  => 'El campo {field} no es válido.'
        ],
        'estado' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número.',
            'in_list'  => 'El campo {field} debe ser 0 o 1.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // -----------------------
    // Helper methods
    // -----------------------

    /**
     * Crea un administrador. Recibe array con keys: dni,nombre,password,categoria,estado
     * Hashea la contraseña antes de guardar.
     * Retorna insert id o false.
     */
    public function createAdministrador(array $data)
    {
        if (empty($data['password'])) {
            return false;
        }
        // hash password
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        return $this->insert($data);
    }

    

   
    public function updateAdministrador(int $id, string $newPassword, ?string $newCategoria = null)
    {
        $data = [
            'password' => password_hash($newPassword, PASSWORD_BCRYPT),
        ];

        if ($newCategoria !== null) {
            $data['categoria'] = $newCategoria;
        }

        return $this->update($id, $data);
    }

    /**
     * Elimina (soft delete) administrador por id.
     * Retorna boolean/int según Model::delete
     */
    public function eliminarAdministrador(int $id)
    {
        return $this->delete($id);
    }

    /**
     * Buscar administrador por DNI.
     * Retorna array|null
     */
    public function findByDni(string $dni)
    {
        return $this->where('dni', $dni)->first();
    }
}