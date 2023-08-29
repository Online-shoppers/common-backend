import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';
import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiResponse({ type: CartDto })
  @Get()
  findCart(@CurrentUser() user: UserSessionDto) {
    return this.cartService.getUsersCart(user.id);
  }

  @ApiResponse({ type: CartProductDto, isArray: true })
  @Get('/products')
  @RestrictRequest(UserPermissions.GetOtherCarts)
  findCartProducts(@CurrentUser() user: UserSessionDto) {
    return this.cartService.getUserCartProducts(user.id);
  }

  @ApiResponse({ type: CartDto })
  @Post('/products/:productId')
  addProductToCart(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
    @CurrentUser() user: UserSessionDto,
  ) {
    return this.cartService.addProductToCart(user.id, productId, quantity);
  }

  @ApiResponse({ type: CartDto })
  @Put('/products/:cartProductId')
  updateProductInCart(
    @Param('cartProductId', ParseUUIDPipe) cartProductId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
    @CurrentUser() user: UserSessionDto,
  ) {
    return this.cartService.updateProductInCart(
      user.id,
      cartProductId,
      quantity,
    );
  }

  @ApiResponse({ type: CartDto })
  @Delete('/products/:cartProductId')
  async deleteProductFromCart(
    @Param('cartProductId', ParseUUIDPipe) cartProductId: string,
    @CurrentUser() user: UserSessionDto,
  ) {
    return this.cartService.deleteProductFromCart(user.id, cartProductId);
  }

  @ApiResponse({ type: CartDto })
  @Delete('/products')
  clearCart(@CurrentUser() user: UserSessionDto) {
    return this.cartService.clearCart(user.id);
  }
}
