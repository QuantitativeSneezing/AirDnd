const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require("../../db/utils/auth");
const { User } = require("../../db/models")
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});
router.use(restoreUser);

router.get('/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);
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
