import { Migration } from '@mikro-orm/migrations';

export class Migration20230818004904 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "refresh_tokens" alter column "token" type varchar(500) using ("token"::varchar(500));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "refresh_tokens" alter column "token" type varchar(255) using ("token"::varchar(255));',
    );
  }
}
