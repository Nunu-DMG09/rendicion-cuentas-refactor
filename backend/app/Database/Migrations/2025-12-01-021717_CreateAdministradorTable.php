<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAdministradorTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'dni'         => ['type' => 'VARCHAR', 'constraint' => 8, 'null' => false],
            'nombre'      => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'password'    => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            // ENUM via raw type
            'categoria'   => ['type' => "ENUM('admin','super_admin')", 'null' => false],
            'estado'      => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1, 'null' => false],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('administrador', true);
    }

    public function down()
    {
        $this->forge->dropTable('administrador', true);
    }
}
