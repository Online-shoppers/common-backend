import { Migration } from '@mikro-orm/migrations';

export class Migration20230829195535 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "products" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(500) not null, "image_url" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'beer\', \'snacks\', \'accessories\')) not null, "type" text check ("type" in (\'ALE\', \'LAGER\', \'WHEAT_BEER\', \'PRETZELS\', \'NACHOS\', \'SPICY_WINGS\', \'BEER_GLASSES\', \'BOTTLE_OPENER\', \'BEER_COASTERS\')) not null, "archived" boolean not null default false, "abv" int null, "country" varchar(255) null, "volume" int null, "ibu" int null, "weight" int null, constraint "products_pkey" primary key ("id"));',
    );
    this.addSql(
      'create index "products_category_index" on "products" ("category");',
    );

    this.addSql(
      'create table "user_roles" ("id" uuid not null, "type" text not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "permissions" text[] not null, "is_default" boolean not null, constraint "user_roles_pkey" primary key ("id", "type"));',
    );

    this.addSql(
      'create table "user" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "password" varchar(255) not null, "archived" boolean not null default false, "role_id" uuid not null, "role_type" text not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "reviews" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "text" varchar(1000) not null, "rating" int not null, "edited" boolean not null, "archived" boolean not null, "user_id" uuid not null, "product_id" uuid not null, constraint "reviews_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "refresh_tokens" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "token" varchar(500) not null, "user_id" uuid not null, constraint "refresh_tokens_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "order" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'PENDING\', \'AWAITING_SHIPMENT\', \'SHIPPED\', \'REFUNDED\')) not null, "country" varchar(255) not null, "city" varchar(255) not null, "zip_code" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, "buyer_id" uuid not null, constraint "order_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "order_product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "order_id" uuid not null, constraint "order_product_entity_pkey" primary key ("id"));',
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
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade;',
    );

    this.addSql(
      'alter table "reviews" add constraint "reviews_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "reviews" add constraint "reviews_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "order" add constraint "order_buyer_id_foreign" foreign key ("buyer_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "order_product_entity" add constraint "order_product_entity_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "cart-product" add constraint "cart-product_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;',
    );
  }
}
