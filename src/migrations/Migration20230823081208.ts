import { Migration } from '@mikro-orm/migrations';

export class Migration20230823081208 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order_item_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, constraint "order_item_entity_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "products" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "image_url" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'beer\', \'snacks\', \'accessories\')) not null, "archived" boolean not null default false, "descr" text check ("descr" in (\'product\', \'accessory\', \'beer\', \'snacks\')) not null, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "type" text check ("type" in (\'xrusteam\', \'chips\', \'fish\')) null, "weight" int null, constraint "products_pkey" primary key ("id"));',
    );
    this.addSql('create index "products_descr_index" on "products" ("descr");');

    this.addSql(
      'create table "order" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'PENDING\', \'AWAITING_SHIPMENT\', \'SHIPPED\', \'REFUNDED\')) not null, "country" varchar(255) not null, "city" varchar(255) not null, "zip_code" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, "buyer_id" uuid not null, constraint "order_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "cart" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "user_id" uuid not null, constraint "cart_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "cart" add constraint "cart_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'create table "cart-product" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "category" text check ("category" in (\'beer\', \'snacks\', \'accessories\')) not null, "quantity" int not null, "cart_id" uuid not null, "product_id" uuid not null, constraint "cart-product_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_unique" unique ("product_id");',
    );

    this.addSql(
      'alter table "order" add constraint "order_buyer_id_foreign" foreign key ("buyer_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart-product" add constraint "cart-product_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );

    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "cart-product" drop constraint "cart-product_product_id_foreign";',
    );

    this.addSql(
      'alter table "cart-product" drop constraint "cart-product_cart_id_foreign";',
    );

    this.addSql('drop table if exists "order_item_entity" cascade;');

    this.addSql('drop table if exists "products" cascade;');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "cart" cascade;');

    this.addSql('drop table if exists "cart-product" cascade;');

    this.addSql('alter table "user" drop constraint "user_email_unique";');

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }
}
