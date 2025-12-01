<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePreguntaTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'contenido'  => ['type' => 'TEXT', 'null' => false],
            'id_usuario' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'id_eje'     => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_usuario');
        $this->forge->addKey('id_eje');
        $this->forge->createTable('pregunta', true);

        $this->db->query('ALTER TABLE `pregunta` ADD CONSTRAINT `fk_p_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
        $this->db->query('ALTER TABLE `pregunta` ADD CONSTRAINT `fk_p_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `pregunta` DROP FOREIGN KEY IF EXISTS `fk_p_eje`;');
        $this->db->query('ALTER TABLE `pregunta` DROP FOREIGN KEY IF EXISTS `fk_p_usuario`;');
        $this->forge->dropTable('pregunta', true);
    }
}
