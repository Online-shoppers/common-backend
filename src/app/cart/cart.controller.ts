import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';
import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findCart(@CurrentUser() user: UserSessionDto) {
    return this.cartService.getUsersCart(user.id);
  }

  @Get(':userId')
  @RestrictRequest(UserPermissions.GetOtherCarts)
  findCartById(
    @CurrentUser() user: UserSessionDto,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to request other peoples carts',
      );
    }
    return this.cartService.getUsersCart(userId);
  }

  @Get('/products')
  @RestrictRequest(UserPermissions.GetOtherCarts)
  findCartProducts(@CurrentUser() user: UserSessionDto) {
    if (!user) {
      throw new ForbiddenException('You have to log in to edit cart');
    }

    return this.cartService.getUserCartProducts(user.id);
  }

  @Post('/products/:productId')
  addProductToCart(
    @Query('productId') productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
    @CurrentUser() user: UserSessionDto,
  ) {
    if (!user) {
      throw new ForbiddenException('You have to log in to edit cart');
    }

    return this.cartService.addProductToCart(user.id, productId, quantity);
  }

  @Put('/products/:cartProductId')
  updateProductInCart(
    @Query('cartProductId') cartProductId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
    @CurrentUser() user: UserSessionDto,
  ) {
    if (!user) {
      throw new ForbiddenException('You have to log in to edit cart');
    }

    return this.cartService.updateProductInCart(
      user.id,
      cartProductId,
      quantity,
    );
  }

  @Delete('/products')
  clearCart(@CurrentUser() user: UserSessionDto) {
    if (!user) {
      throw new ForbiddenException('You have to log in to edit cart');
    }

    return this.cartService.clearCart(user.id);
  }
}
