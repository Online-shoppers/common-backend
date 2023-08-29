export enum UserPermissions {
  All = 'permissions.all',

  // Products
  CanManageProducts = 'permissions.products.manage',
  CanLeaveReviews = 'permissions.products.leave-reviews',

  // Users
  GetUsers = 'permissions.users.get-users',

  // Carts
  GetOtherCarts = 'permissions.carts.get-other-carts',
}
