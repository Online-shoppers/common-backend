import { AccessoryTypes } from 'app/accessories/enums/accessory-types.enum';
import { BeerTypes } from 'app/beer/enums/beer-types.enum';
import { SnackTypes } from 'app/snacks/enums/snack-types.enum';

export enum ProductTypes {
  // Beer
  ALE = BeerTypes.ALE,
  LAGER = BeerTypes.LAGER,
  WHEAT_BEER = BeerTypes.WHEAT_BEER,

  // Snacks
  PRETZELS = SnackTypes.PRETZELS,
  NACHOS = SnackTypes.NACHOS,
  SPICY_WINGS = SnackTypes.SPICY_WINGS,

  // Accessories
  BEER_GLASSES = AccessoryTypes.BEER_GLASSES,
  BOTTLE_OPENER = AccessoryTypes.BOTTLE_OPENER,
  BEER_COASTERS = AccessoryTypes.BEER_COASTERS,
}
