import { Migration } from '@mikro-orm/migrations';

export class Migration20230822090027 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'PENDING\', \'AWAITING_SHIPMENT\', \'SHIPPED\', \'REFUNDED\')) not null, "country" varchar(255) not null, "city" varchar(255) not null, "zip_code" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, constraint "order_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "category" text check ("category" in (\'Schema A\', \'Schema B\', \'Schema C\')) not null, "archived" boolean not null default false, "discr" text check ("discr" in (\'Product\', \'beer\')) not null, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "price" int null, "quantity" int null, "type" text check ("type" in (\'123\', \'123\', \'123\')) null, constraint "product_entity_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "product_entity_discr_index" on "product_entity" ("discr");',
    );

    this.addSql(
      'create table "user_roles" ("id" uuid not null, "type" text not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "permissions" text[] not null, "is_default" boolean not null, constraint "user_roles_pkey" primary key ("id", "type"));',
    );

    this.addSql(
      'create table "user" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "password" varchar(255) not null, "archived" boolean not null default false, "role_id" uuid null, "role_type" text null, constraint "user_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "refresh_tokens" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "token" varchar(500) not null, "user_id" uuid not null, constraint "refresh_tokens_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "cart" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "user_id" uuid not null, constraint "cart_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "cart" add constraint "cart_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'create table "cart-product" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "category" text check ("category" in (\'Schema A\', \'Schema B\', \'Schema C\')) not null, "quantity" int not null, "cart_id" uuid not null, "product_id" uuid not null, constraint "cart-product_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_unique" unique ("product_id");',
    );

    this.addSql(
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart-product" add constraint "cart-product_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_foreign" foreign key ("product_id") references "product_entity" ("id") on update cascade;',
    );
  }
}
