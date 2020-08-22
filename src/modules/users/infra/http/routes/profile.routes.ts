import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UserProfileController from '../controllers/UserProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const userProfileController = new UserProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', userProfileController.getInfo);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  userProfileController.update,
);

export default profileRouter;
