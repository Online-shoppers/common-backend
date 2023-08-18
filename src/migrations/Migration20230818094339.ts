import { Migration } from '@mikro-orm/migrations';

export class Migration20230818094339 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'PENDING\', \'AWAITING_SHIPMENT\', \'SHIPPED\', \'REFUNDED\')) not null, "country" varchar(255) not null, "city" varchar(255) not null, "zip_code" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, constraint "order_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'Schema A\', \'Schema B\', \'Schema C\')) not null, "archived" boolean not null default false, "discr" text check ("discr" in (\'Product\', \'beer\', \'snacks\')) not null, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "price" int null, "wieght" int null, "type" text check ("type" in (\'123\', \'123\', \'123\')) null, constraint "product_entity_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "product_entity_discr_index" on "product_entity" ("discr");',
    );

    this.addSql(
      'create table "user" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "password" varchar(255) not null, "archived" boolean not null, constraint "user_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "product_entity" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }
}
