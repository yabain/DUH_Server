/**
 * Permissions based authorization.
 * @param {string[]} permissions The optional permissions (array|list) to check.
 * @author dassiorleando
 */
module.exports.check = (permissions = []) => {
  /**
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  const checker = (req, res, next) => {
    // Be sure that permissions is always a list of elements
    if (typeof permissions === "string" || permissions instanceof String) {
      permissions = [permissions];
    }

    // Work only for authenticated user
    if (!req.user)
      return res
        .status(403)
        .json({
          status: false,
          message: "Not authorized to perform this action!",
          code: "no_user",
        });

    // No permissions is requested
    if (permissions.length === 0) return next();

    // The current logged in user's permissions
    const userPermissions = req.user.permissions || [];

    // Check if at least one permission is present
    const found = permissions.some((p) => userPermissions.indexOf(p) !== -1);
    if (found) {
      next();
    } else {
      res
        .status(403)
        .json({
          status: false,
          message: "Not authorized to perform this action!",
          code: "un_authorized_action",
        });
    }
  };

  return checker;
};
