import { Migration } from '@mikro-orm/migrations';

export class Migration20230823090327 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order_product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "order_id" uuid not null, constraint "order_product_entity_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "order_product_entity" add constraint "order_product_entity_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;',
    );

    this.addSql('drop table if exists "order_item_entity" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "order_item_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, constraint "order_item_entity_pkey" primary key ("id"));',
    );

    this.addSql('drop table if exists "order_product_entity" cascade;');
  }
}
