import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('/products/:id')
  findCartProducts(@Param('id') cartId: string) {
    return this.cartService.getCartProducts(cartId);
  }

  @Post(':userId/:productId')
  addProductToCart(
    @Param('userId') userId: string,
    @Query('productId') productId: string,
  ) {
    return this.cartService.addProductToCart(userId, productId);
  }

  @Delete(':id')
  clearCart(@Param('id') id: string) {
    return this.cartService.clearCart(id);
  }
}
