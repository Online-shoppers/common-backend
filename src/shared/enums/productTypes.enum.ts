import { BeerTypes } from 'app/beer/enums/beer-types.enum';
import { SnackTypes } from 'app/snacks/enums/snack-types.enum';

export enum ProductTypes {
  ALE = BeerTypes.ALE,
  LAGER = BeerTypes.LAGER,
  WHEAT_BEER = BeerTypes.WHEAT_BEER,
  PRETZELS = SnackTypes.PRETZELS,
  NACHOS = SnackTypes.NACHOS,
  SPICY_WINGS = SnackTypes.SPICY_WINGS,
  BEER_GLASSES = 'BEER_GLASSES',
  BOTTLE_OPENER = 'BOTTLE_OPENER',
  BEER_COASTERS = 'BEER_COASTERS',
}
