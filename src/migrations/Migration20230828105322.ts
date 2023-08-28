import { Migration } from '@mikro-orm/migrations';

export class Migration20230828105322 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }
}