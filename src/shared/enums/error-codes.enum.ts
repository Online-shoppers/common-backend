export enum ErrorCodes {
  InvalidForm = 'errors.invalid-form',
  InvalidTokens = 'errors.invalid-tokens',

  FieldShouldBeString = '.errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.field-invalid.should-be-email',
  FieldQuantityShouldBePositive = 'field-invalid.quantity-should-be-positive',

  NotAuthorizedRequest = 'errors.not-authorized.request',

  InvalidStatus_UserInactive = 'errors.invalid-status.user-inactive',

  NotExists_User = 'errors.not-exists.user',
  NotExists_Review = 'errors.not-exists.review',

  NotExists_Product = 'errors.not-exists.product',
  Exists_User = 'errors.already-exists.user',
  Invalid_Creds = 'errors.invalid-creds',
  Invalid_Password = 'errors.invalid-password',
  ForbiddenReset_WrongUser = 'errors.reset-password.forbidden.wrong-user',

  NotEnough_Product = 'errors.not-enough.product',
  NoSuchItem_Cart = 'errors.not-such-item.cart',
  Delete_Reviews = 'errors.not_allowed_delete.reviews',
  Invalid_Permission = 'errors.not_allowed_action.permission',
}
