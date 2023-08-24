import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

import { AccessoryEntity } from 'app/accessories/entities/accessory.entity';
import { BeerEntity } from 'app/beer/entities/beer.entity';
import { SnacksEntity } from 'app/snacks/entities/snack.entity';
import { UserRoleEntity } from 'app/user-roles/entities/user-role.entity';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';
import { UserRoles } from 'app/user-roles/enums/user-roles.enum';
import { UserEntity } from 'app/user/entities/user.entity';

import { ProductCategory } from 'shared/enums/productCategory.enum';
import { ProductTypes } from 'shared/enums/productTypes.enum';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Roles
    const defaultRole = em.create(UserRoleEntity, {
      name: UserRoles.Client,
      type: UserRoles.Client,
      permissions: [UserPermissions.GetUsers],
      isDefault: true,
    });

    const superAdminRole = em.create(UserRoleEntity, {
      name: UserRoles.SuperAdmin,
      type: UserRoles.SuperAdmin,
      permissions: [UserPermissions.All],
      isDefault: false,
    });

    await em.persistAndFlush([defaultRole, superAdminRole]);

    // Admin user
    const superAdmin = em.create(UserEntity, {
      email: 'super-admin@gmail.com',
      password: await bcrypt.hash('string123', 10),
      orders: [],
      refreshTokens: [],
      firstName: 'admin',
      lastName: 'super',
      role: superAdminRole,
      archived: false,
      cart: { products: [] },
    });

    await em.persistAndFlush(superAdmin);

    // ALE = 'Ale',
    // LAGER = 'Lager',
    // WHEAT_BEER = 'Wheat Beer',
    // PRETZELS = 'Pretzels',
    // NACHOS = 'Nachos',
    // SPICY_WINGS = 'Spicy Wings',
    // BEER_GLASSES = 'Beer Glasses',
    // BOTTLE_OPENER = 'Bottle Opener',
    // BEER_COASTERS = 'Beer Coasters',

    // Beer
    const ale = em.create(BeerEntity, {
      name: 'Hitachino White Ale',
      description: 'One of the best Belgian style white ales comes from Japan.',
      type: ProductTypes.ALE,
      abv: 10,
      ibu: 10,
      price: 30,
      volume: 1,
      country: 'Ireland',
      archived: false,
      category: ProductCategory.CATEGORY_BEER,
      quantity: 1000,
      image_url:
        'https://vinepair.com/wp-content/uploads/2016/12/roundup-hitachino-nest.jpg',
    });

    const lager = em.create(BeerEntity, {
      name: 'Augustiner lagerbier hell',
      description:
        'Brewed in Munich, according to the German Purity Law, Augustiner lagerbier hell is an exemplary helles lager. A German pale lager style typically brewed in the south of Germany, helles (or hell) takes its name from the German terms for “bright”.',
      type: ProductTypes.LAGER,
      abv: 10,
      ibu: 10,
      price: 25,
      volume: 1,
      country: 'Austria',
      archived: false,
      category: ProductCategory.CATEGORY_BEER,
      quantity: 1000,
      image_url:
        'https://static.independent.co.uk/2022/09/13/09/Augustiner%20lagerbier%20hell.png?quality=75&width=320&auto=webp 320w, https://static.independent.co.uk/2022/09/13/09/Augustiner%20lagerbier%20hell.png?quality=75&width=640&auto=webp 640w',
    });

    const beer = em.create(BeerEntity, {
      name: 'Heineken Premium Lager Beer Quart Bottle',
      description: 'Heineken is pale in colour with a fresh, crisp taste.',
      type: ProductTypes.WHEAT_BEER,
      abv: 10,
      ibu: 10,
      price: 7.6,
      volume: 1,
      country: 'America',
      archived: false,
      category: ProductCategory.CATEGORY_BEER,
      quantity: 1000,
      image_url:
        'https://media.nedigital.sg/fairprice/fpol/media/images/product/XL/10170935_XL1_20230113.jpg',
    });

    await em.persistAndFlush([ale, lager, beer]);

    // Snacks
    const nachos = em.create(SnacksEntity, {
      name: 'Nachos',
      description:
        'Chicken Nachos – Spicy and unique, these chicken nachos will bring the whole family together for a feast to remember. The pleasant crunch of tortilla chips topped with tender chicken, melty cheese, spicy jalapenos, and sour cream is a sure hit.',
      type: ProductTypes.NACHOS,
      price: 10,
      weight: 100,
      archived: false,
      category: ProductCategory.CATEGORY_SNACKS,
      quantity: 1000,
      image_url:
        'https://www.maggi.ru/data/images/recept/img640x500/recept_3621_j42a.jpg',
    });

    const pretzel = em.create(SnacksEntity, {
      name: 'Pretzel',
      description:
        'Soft and chewy on the inside, crispy and golden on the outside, these Homemade Soft Pretzels are a fun snack that bake up in the oven and served with a delicious cheese sauce!',
      type: ProductTypes.PRETZELS,
      price: 3,
      weight: 30,
      archived: false,
      category: ProductCategory.CATEGORY_SNACKS,
      quantity: 1000,
      image_url:
        'https://www.thecountrycook.net/wp-content/uploads/2022/07/thumbnail-Homemade-Soft-Pretzels-scaled.jpg',
    });

    const wings = em.create(SnacksEntity, {
      name: 'Chicken wings',
      description:
        'These baked BBQ chicken wings are an easy appetizer to prepare for game day and gatherings. The crispy pieces are coated with a sticky, sweet, and tangy sauce.',
      type: ProductTypes.SPICY_WINGS,
      price: 8,
      weight: 200,
      archived: false,
      category: ProductCategory.CATEGORY_SNACKS,
      quantity: 1000,
      image_url:
        'https://www.jessicagavin.com/wp-content/uploads/2023/01/BBQ-chicken-wings-21-1200.jpg',
    });

    await em.persistAndFlush([nachos, pretzel, wings]);

    // Accessories
    const glass = em.create(AccessoryEntity, {
      name: 'Lodrat',
      description:
        'Lodrat is perfect for lager. The glass has a curvy design that brings out the flavours and scents of the beer and gives a nose-tickling head of foam.',
      type: ProductTypes.BEER_GLASSES,
      price: 8,
      weight: 70,
      archived: false,
      category: ProductCategory.CATEGORY_ACCESSORIES,
      quantity: 1000,
      image_url:
        'https://www.ikea.com/us/en/images/products/lodraet-beer-glass-clear-glass__0712433_pe728846_s5.jpg?f=xl',
    });

    const coaster = em.create(AccessoryEntity, {
      name: 'Beer coasters',
      description:
        'Custom beer coasters hold your beer and promote your brand. Each beer coaster is printed in full color on thick, premium coaster board and cut precisely into a 3.7" circle.',
      type: ProductTypes.BEER_COASTERS,
      price: 8,
      weight: 25,
      archived: false,
      category: ProductCategory.CATEGORY_ACCESSORIES,
      quantity: 1000,
      image_url:
        'https://assets.stickermule.com/image/fetch/c_lfill,fl_lossy,f_auto,h_720,q_auto:best,w_1320/https%3A%2F%2Fstorage.googleapis.com%2Fsm-content%2Fcore%2Fproducts%2FproductAliases%2Fbeer-coasters%2Fgallery_3',
    });

    const opener = em.create(AccessoryEntity, {
      name: 'Beer opener',
      description:
        'Automatic Beer Bottle Opener,Magnet Beer Opener,Stainless Steel Push Down Opener Wine Beer Soda Cap Opener Kitchen Accessories',
      type: ProductTypes.BOTTLE_OPENER,
      price: 15,
      weight: 25,
      archived: false,
      category: ProductCategory.CATEGORY_ACCESSORIES,
      quantity: 1000,
      image_url:
        'https://ae04.alicdn.com/kf/H7df5c7d8236846d4a6ab5b9798ba2140p.jpg',
    });

    await em.persistAndFlush([glass, coaster, opener]);
  }
}
