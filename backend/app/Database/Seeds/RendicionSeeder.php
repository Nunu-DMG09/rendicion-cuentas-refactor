<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RendicionSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();
        $now = '2025-11-29 04:29:34';

        
        $admin = [
            'dni'        => '40346175',
            'nombre'     => 'MARTHA LUZ TUÑOQUE JULCAS',
            'password'   => password_hash('Otic@2025', PASSWORD_BCRYPT),
            'categoria'  => 'super_admin',
            'estado'     => 1,
            'created_at' => $now,
            'updated_at' => $now,
            'deleted_at' => null,
        ];
        $db->table('administrador')->insert($admin);

    
        $ejes = [
            ['tematica' => 'Medio Ambiente',       'estado' => 0, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Educación y Cultura',  'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Salud Pública',        'estado' => 0, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Seguridad Ciudadana',  'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Infraestructura',      'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Limpieza Pública',     'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Institucionalidad',    'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['tematica' => 'Desarrollo Social',    'estado' => 1, 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
        ];

        $db->table('eje')->insertBatch($ejes);
    }
}
