import { Migration } from '@mikro-orm/migrations';

export class Migration20230824100755 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "products" drop constraint if exists "products_descr_check";',
    );

    this.addSql(
      'alter table "user" drop constraint "user_role_id_role_type_foreign";',
    );

    this.addSql(
      'alter table "products" alter column "descr" type text using ("descr"::text);',
    );
    this.addSql(
      "alter table \"products\" add constraint \"products_descr_check\" check (\"descr\" in ('product', 'beer', 'accessory', 'snacks'));",
    );

    this.addSql('alter table "user" alter column "role_id" drop default;');
    this.addSql(
      'alter table "user" alter column "role_id" type uuid using ("role_id"::text::uuid);',
    );
    this.addSql('alter table "user" alter column "role_id" set not null;');
    this.addSql(
      'alter table "user" alter column "role_type" type text using ("role_type"::text);',
    );
    this.addSql('alter table "user" alter column "role_type" set not null;');
    this.addSql(
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "products" drop constraint if exists "products_descr_check";',
    );

    this.addSql(
      'alter table "user" drop constraint "user_role_id_role_type_foreign";',
    );

    this.addSql(
      'alter table "products" alter column "descr" type text using ("descr"::text);',
    );
    this.addSql(
      "alter table \"products\" add constraint \"products_descr_check\" check (\"descr\" in ('product', 'accessory', 'beer', 'snacks'));",
    );

    this.addSql('alter table "user" alter column "role_id" drop default;');
    this.addSql(
      'alter table "user" alter column "role_id" type uuid using ("role_id"::text::uuid);',
    );
    this.addSql('alter table "user" alter column "role_id" drop not null;');
    this.addSql(
      'alter table "user" alter column "role_type" type text using ("role_type"::text);',
    );
    this.addSql('alter table "user" alter column "role_type" drop not null;');
    this.addSql(
      'alter table "user" add constraint "user_role_id_role_type_foreign" foreign key ("role_id", "role_type") references "user_roles" ("id", "type") on update cascade on delete set null;',
    );
  }
}
