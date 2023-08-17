import { Migration } from '@mikro-orm/migrations';

export class Migration20230817160411 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "products" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "category" text check ("category" in (\'Schema A\', \'Schema B\', \'Schema C\')) not null, "archived" boolean not null default false, "discr" text check ("discr" in (\'Product\', \'beer\')) not null, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "price" int null, "quantity" int null, "type" text check ("type" in (\'123\', \'123\', \'123\')) null, constraint "products_pkey" primary key ("id"));',
    );
    this.addSql('create index "products_discr_index" on "products" ("discr");');

    this.addSql('drop table if exists "product_entity" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "product_entity" ("id" uuid not null default null, "name" varchar not null default null, "description" varchar not null default null, "volume" int4 null default null, "archived" bool not null default false, "created" timestamptz not null default null, "updated" timestamptz not null default null, "category" text check ("category" in (\'Schema A\', \'Schema B\', \'Schema C\')) not null default null, "discr" text check ("discr" in (\'Product\', \'beer\')) not null default null, "abv" int4 null default null, "country" varchar null default null, "ibu" int4 null default null, "price" int4 null default null, "quantity" int4 null default null, "type" text check ("type" in (\'123\', \'123\', \'123\')) null default null, constraint "product_entity_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "product_entity_discr_index" on "product_entity" ("discr");',
    );

    this.addSql('drop table if exists "products" cascade;');
  }
}
