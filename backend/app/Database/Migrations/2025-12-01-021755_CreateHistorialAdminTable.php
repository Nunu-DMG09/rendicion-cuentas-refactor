<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateHistorialAdminTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'           => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'id_admin'     => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => false],
            'accion'       => ['type' => "ENUM('habilitar','deshabilitar','crear','editar_password', 'edit_categoria')", 'null' => false],
            'motivo'       => ['type' => 'TEXT', 'null' => true],
            'realizado_por'=> ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => false],
            'created_at'   => ['type' => 'DATETIME', 'null' => true],
            'updated_at'   => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'   => ['type' => 'DATETIME', 'null' => true],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_admin');
        $this->forge->addKey('realizado_por');
        $this->forge->createTable('historial_admin', true);

        // foreign keys
        $this->db->query('ALTER TABLE `historial_admin` ADD CONSTRAINT `fk_ha_admin` FOREIGN KEY (`id_admin`) REFERENCES `administrador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
        $this->db->query('ALTER TABLE `historial_admin` ADD CONSTRAINT `fk_ha_realizado` FOREIGN KEY (`realizado_por`) REFERENCES `administrador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `historial_admin` DROP FOREIGN KEY IF EXISTS `fk_ha_admin`;');
        $this->db->query('ALTER TABLE `historial_admin` DROP FOREIGN KEY IF EXISTS `fk_ha_realizado`;');
        $this->forge->dropTable('historial_admin', true);
    }
}
