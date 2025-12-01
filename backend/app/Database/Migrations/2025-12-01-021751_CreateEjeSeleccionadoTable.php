<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEjeSeleccionadoTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'                 => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'id_rendicion'       => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'id_eje'             => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'cantidad_pregunta'  => ['type' => 'INT', 'constraint' => 11, 'default' => 0, 'null' => false],
            'created_at'         => ['type' => 'DATETIME', 'null' => true],
            'updated_at'         => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'         => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_rendicion');
        $this->forge->addKey('id_eje');
        $this->forge->createTable('eje_seleccionado', true);

        // foreign keys
        $this->db->query('ALTER TABLE `eje_seleccionado` ADD CONSTRAINT `fk_es_eje` FOREIGN KEY (`id_eje`) REFERENCES `eje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
        $this->db->query('ALTER TABLE `eje_seleccionado` ADD CONSTRAINT `fk_es_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `eje_seleccionado` DROP FOREIGN KEY IF EXISTS `fk_es_eje`;');
        $this->db->query('ALTER TABLE `eje_seleccionado` DROP FOREIGN KEY IF EXISTS `fk_es_rendicion`;');
        $this->forge->dropTable('eje_seleccionado', true);
    }
}
