import { Migration } from '@mikro-orm/migrations';

export class Migration20230830200510 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_roles" alter column "permissions" type text[] using ("permissions"::text[]);',
    );
  }
}
