import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.cartService.getUsersCart(userId);
  }

  @Get('/:userId/products')
  findCartProducts(@Param('userId') cartId: string) {
    return this.cartService.getUserCartProducts(cartId);
  }

  @Post(':userId/:productId')
  addProductToCart(
    @Param('userId') userId: string,
    @Query('productId') productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.addProductToCart(userId, productId, quantity);
  }

  @Put(':userId/:cartProductId')
  updateProductInCart(
    @Param('userId') userId: string,
    @Query('cartProductId') cartProductId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateProductInCart(
      userId,
      cartProductId,
      quantity,
    );
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
