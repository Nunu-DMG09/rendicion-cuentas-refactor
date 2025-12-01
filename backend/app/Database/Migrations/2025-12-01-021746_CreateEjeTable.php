<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEjeTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'tematica'   => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => false],
            'estado'     => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1, 'null' => false],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('eje', true);
    }

    public function down()
    {
        $this->forge->dropTable('eje', true);
    }
}
