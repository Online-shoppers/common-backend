import { Migration } from '@mikro-orm/migrations';

export class Migration20230816140124 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" alter column "archived" type boolean using ("archived"::boolean);',
    );
    this.addSql(
      'alter table "user" alter column "archived" set default false;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" alter column "archived" drop default;');
    this.addSql(
      'alter table "user" alter column "archived" type boolean using ("archived"::boolean);',
    );
  }
}
