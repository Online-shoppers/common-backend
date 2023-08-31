import { Migration } from '@mikro-orm/migrations';

export class Migration20230831114122 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "cart-product" drop constraint "cart-product_product_id_unique";',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "cart-product" add constraint "cart-product_product_id_unique" unique ("product_id");',
    );
  }
}
