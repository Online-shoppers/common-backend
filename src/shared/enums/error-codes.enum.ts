export enum ErrorCodes {
  InvalidForm = 'errors.errors.invalid-form',
  InvalidTokens = 'errors.errors.invalid-tokens',
  FieldShouldBeString = 'errors.errors.field-invalid.should-be-string',
  FieldShouldBeNumber = 'errors.errors.field-invalid.should-be-number',
  FieldShouldBeEnum = 'errors.errors.field-invalid.should-be-enum',
  FieldShouldBeEmail = 'errors.errors.field-invalid.should-be-email',

  NotAuthorizedRequest = 'errors.errors.not-authorized.request',

  InvalidStatus_UserInactive = 'errors.errors.invalid-status.user-inactive',

  NotExists_User = 'errors.errors.not-exists.user',

  NotExists_Product = 'errors.errors.not-exists.product',
  Exists_User = 'errors.errors.already-exists.user',
  Invalid_Creds = 'errors.errors.invalid-creds',

  NotEnough_Product = 'errors.errors.not-enough.product',
  NoSuchItem_Cart = 'errors.errors.not-such-item.cart',
  Delete_Reviews = 'errors.errors.not_allowed_delete.reviews',
  Invalid_Permission = 'errors.errors.not_allowed_action.permission',
}
