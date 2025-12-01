<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePreguntaSeleccionadaTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                   => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'id_eje_seleccionado'  => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'id_pregunta'          => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'created_at'           => ['type' => 'DATETIME', 'null' => true],
            'updated_at'           => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'           => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_eje_seleccionado');
        $this->forge->addKey('id_pregunta');
        $this->forge->createTable('pregunta_seleccionada', true);

        $this->db->query('ALTER TABLE `pregunta_seleccionada` ADD CONSTRAINT `fk_ps_es` FOREIGN KEY (`id_eje_seleccionado`) REFERENCES `eje_seleccionado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
        $this->db->query('ALTER TABLE `pregunta_seleccionada` ADD CONSTRAINT `fk_ps_pregunta` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `pregunta_seleccionada` DROP FOREIGN KEY IF EXISTS `fk_ps_es`;');
        $this->db->query('ALTER TABLE `pregunta_seleccionada` DROP FOREIGN KEY IF EXISTS `fk_ps_pregunta`;');
        $this->forge->dropTable('pregunta_seleccionada', true);
    }
}
