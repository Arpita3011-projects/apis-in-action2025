const express = require('express');
const router = express.Router();
const controller = require('../controllers/videoController');
const { protect, admin } = require('../middleware/auth');

router.get('/', controller.getVideos);
router.get('/:idOrSlug', controller.getVideo);
router.post('/', protect, admin, controller.createVideo);
router.put('/:id', protect, admin, controller.updateVideo);
router.delete('/:id', protect, admin, controller.deleteVideo);
router.post('/:id/like', controller.likeVideo);
router.post('/:id/unlike', controller.unlikeVideo);

module.exports = router;