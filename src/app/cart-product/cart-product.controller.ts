import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CartProductService } from './cart-product.service';
import { CartProductDto } from './dto/cart-product.dto';

@ApiTags('Cart Product')
@Controller('cart-product')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @ApiResponse({ type: CartProductDto, isArray: true })
  @Get(':id')
  async findAllInCart(cartId: string) {
    return this.cartProductService.getCartProducts(cartId);
  }

  // @ApiBody({ type: CreateCartProductForm })
  // @Post()
  // addProductToCart(@Body() orderForm: NewOrderForm) {
  //   return this.orderService.create(orderForm);
  // }
}
