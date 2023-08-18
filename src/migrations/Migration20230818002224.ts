import { Migration } from '@mikro-orm/migrations';

export class Migration20230818002224 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_roles" ("id" uuid not null, "type" text not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, "permissions" text[] not null, "is_default" boolean not null, constraint "user_roles_pkey" primary key ("id", "type"));',
    );

    this.addSql(
      'create table "refresh_tokens" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "token" varchar(255) not null, "user_id" uuid not null, constraint "refresh_tokens_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user" add column "role_id" uuid null, add column "role_type" text null;',
    );
    this.addSql(
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user" drop constraint "user_role_id_role_type_foreign";',
    );

    this.addSql('drop table if exists "user_roles" cascade;');

    this.addSql('drop table if exists "refresh_tokens" cascade;');

    this.addSql('alter table "user" drop column "role_id";');
    this.addSql('alter table "user" drop column "role_type";');
  }
}
