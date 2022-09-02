const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require("../../db/utils/auth");
const { User } = require("../../db/models")
const usersRouter= require("./users")
const sessionRouter= require("./session")
const spotsRouter= require("./spots")
const reviewsRouter= require("./reviews")
const bookingsRouter= require("./bookings")
const spotImagesRouter= require("./spot-images")

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use("/bookings", bookingsRouter)

router.use("/spot-images", spotImagesRouter)


router.get('/restore-user',
(req, res) => {
  return res.json(req.user);
}
);

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

router.get('/set-token-cookie', async (_req, res) => {
  console.log("hello")
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user });
});

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);
module.exports = router;
