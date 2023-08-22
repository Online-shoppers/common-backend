import { Migration } from '@mikro-orm/migrations';

export class Migration20230822123857 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'PENDING\', \'AWAITING_SHIPMENT\', \'SHIPPED\', \'REFUNDED\')) not null, "country" varchar(255) not null, "city" varchar(255) not null, "zip_code" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, constraint "order_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "products" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "image_url" varchar(255) not null, "quantity" int not null, "category" smallint not null, "archived" boolean not null default false, "descr" text check ("descr" in (\'product\', \'accessory\', \'beer\', \'snacks\')) not null, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "weight" int null, "type" text[] null, constraint "products_pkey" primary key ("id"));',
    );
    this.addSql('create index "products_descr_index" on "products" ("descr");');

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
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
  }
}
