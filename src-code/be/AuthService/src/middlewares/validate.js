// middlewares/validate.js

// This middleware can be implemented using either Joi or express-validator.
// Here's an example using express-validator:

const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

module.exports = validate;

// Example usage:
// const { check } = require('express-validator');
// const validate = require('../middlewares/validate');
//
// router.post('/register',
//   validate([
//     check('email').isEmail().normalizeEmail(),
//     check('password').isLength({ min: 6 }),
//   ]),
//   AuthController.register
// );

//Or using Joi
// const Joi = require('joi');

// const validate = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       const { details } = error;
//       const message = details.map(i => i.message).join(',');

//       res.status(400).json({ error: message })
//     } else {
//       next();
//     }
//   }
// }

// module.exports = validate;