import { Migration } from '@mikro-orm/migrations';

export class Migration20230821110620 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "products" alter column "category" type text[] using ("category"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "type" type text[] using ("type"::text[]);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "products" alter column "category" type text[] using ("category"::text[]);',
    );
    this.addSql(
      'alter table "products" alter column "type" type text[] using ("type"::text[]);',
    );
  }
}
