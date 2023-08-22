import { Migration } from '@mikro-orm/migrations';

export class Migration20230822103539 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "products" alter column "category" type text[] using ("category"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "category_description" type text[] using ("category_description"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "category_image" type text[] using ("category_image"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "type" type text[] using ("type"::text[]);',
    );

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "products" alter column "category" type text[] using ("category"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "category_description" type text[] using ("category_description"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "category_image" type text[] using ("category_image"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "type" type text[] using ("type"::text[]);',
    );

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }
}
