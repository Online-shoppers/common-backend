import { Migration } from '@mikro-orm/migrations';

export class Migration20230828171855 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "order_product_entity" add column "order_id" uuid not null;',
    );
    this.addSql(
      'alter table "order_product_entity" add constraint "order_product_entity_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "order_product_entity" drop constraint "order_product_entity_order_id_foreign";',
    );

    this.addSql('alter table "order_product_entity" drop column "order_id";');
  }
}
