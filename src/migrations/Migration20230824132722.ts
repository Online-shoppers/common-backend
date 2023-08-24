import { Migration } from '@mikro-orm/migrations';

export class Migration20230824132722 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop index "products_descr_index";');
    this.addSql('alter table "products" drop column "descr";');
    this.addSql(
      'create index "products_category_index" on "products" ("category");',
    );

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      "alter table \"products\" add column \"descr\" text check (\"descr\" in ('product', 'beer', 'accessory', 'snacks')) not null;",
    );
    this.addSql('drop index "products_category_index";');
    this.addSql('create index "products_descr_index" on "products" ("descr");');

    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }
}
