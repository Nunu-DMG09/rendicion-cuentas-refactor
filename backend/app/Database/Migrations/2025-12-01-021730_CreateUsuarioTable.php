<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUsuarioTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nombre'         => ['type' => 'VARCHAR', 'constraint' => 60, 'null' => false],
            'sexo'           => ['type' => "ENUM('M','F')", 'null' => false],
            'tipo_participacion' => ['type' => "ENUM('asistente','orador')", 'null' => false],
            'titulo'         => ['type' => "ENUM('PERSONAL','ORGANIZACION')", 'null' => true],
            'ruc_empresa'    => ['type' => 'VARCHAR', 'constraint' => 11, 'null' => true],
            'nombre_empresa' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'dni'            => ['type' => 'VARCHAR', 'constraint' => 8, 'null' => true],
            'id_rendicion'   => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'asistencia'     => ['type' => "ENUM('si','no')", 'null' => false, 'default' => 'no'],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
            'updated_at'     => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_rendicion');
        $this->forge->createTable('usuario', true);

        
        $this->db->query('ALTER TABLE `usuario` ADD CONSTRAINT `fk_usuario_r` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `usuario` DROP FOREIGN KEY IF EXISTS `fk_usuario_r`;');
        $this->forge->dropTable('usuario', true);
    }
}
