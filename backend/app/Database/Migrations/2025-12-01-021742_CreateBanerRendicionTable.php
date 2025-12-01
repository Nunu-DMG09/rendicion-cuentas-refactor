<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBanerRendicionTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'id_rendicion'=> ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => false],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
            'updated_at'  => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'  => ['type' => 'DATETIME', 'null' => true],
            'file_path'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('id_rendicion');
        $this->forge->createTable('baner_rendicion', true);

        $this->db->query('ALTER TABLE `baner_rendicion` ADD CONSTRAINT `fk_br_rendicion` FOREIGN KEY (`id_rendicion`) REFERENCES `rendicion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;');
    }

    public function down()
    {
        $this->db->query('ALTER TABLE `baner_rendicion` DROP FOREIGN KEY IF EXISTS `fk_br_rendicion`;');
        $this->forge->dropTable('baner_rendicion', true);
    }
}
