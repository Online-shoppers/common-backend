import { Migration } from '@mikro-orm/migrations';

export class Migration20230822124845 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "products" drop constraint if exists "products_category_check";',
    );

    this.addSql(
      'alter table "products" alter column "category" type text using ("category"::text);',
    );
    this.addSql(
      'alter table "products" add constraint "products_category_check" check ("category" in (\'beer\', \'snacks\', \'accessories\'));',
    );
    this.addSql(
      'alter table "products" alter column "type" type text using ("type"::text);',
    );
    this.addSql(
      'alter table "products" add constraint "products_type_check" check ("type" in (\'xrusteam\', \'chips\', \'fish\'));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "products" drop constraint if exists "products_category_check";',
    );
    this.addSql(
      'alter table "products" drop constraint if exists "products_type_check";',
    );

    this.addSql(
      'alter table "products" alter column "category" type smallint using ("category"::smallint);',
    );
    this.addSql(
      'alter table "products" alter column "type" type text[] using ("type"::text[]);',
    );
  }
}
