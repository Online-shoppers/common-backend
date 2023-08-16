import { Migration } from '@mikro-orm/migrations';

export class Migration20230816105451 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "password" varchar(255) not null, "archived" boolean not null, constraint "user_pkey" primary key ("id"));',
    );
  }
}
