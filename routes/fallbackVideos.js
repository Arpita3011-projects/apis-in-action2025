const express = require('express');
const router = express.Router();
const mockData = require('../data/mockData');

// Get all videos with pagination and search
router.get('/', (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let videos = [...mockData.videos];

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      videos = videos.filter(v => 
        searchRegex.test(v.title) || 
        searchRegex.test(v.content)
      );
    }

    const total = videos.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    videos = videos.slice(start, end);

    res.json({
      success: true,
      data: videos,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get video by ID or slug
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const video = mockData.videos.find(v => 
      v._id === idOrSlug || 
      v.slug === idOrSlug
    );

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create video (admin)
router.post('/', (req, res) => {
  try {
    const { title, content, videoUrl, thumbnail, duration } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title required' });
    }

    const newVideo = {
      _id: `${mockData.videos.length + 1}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content,
      videoUrl,
      thumbnail,
      duration,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockData.videos.push(newVideo);
    res.status(201).json({ success: true, message: 'Video added', data: newVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update video (admin)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const videoIndex = mockData.videos.findIndex(v => v._id === id);

    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const video = { ...mockData.videos[videoIndex], ...req.body, updatedAt: new Date().toISOString() };
    mockData.videos[videoIndex] = video;

    res.json({ success: true, message: 'Updated', data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete video (admin)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const videoIndex = mockData.videos.findIndex(v => v._id === id);

    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const video = mockData.videos[videoIndex];
    mockData.videos.splice(videoIndex, 1);

    res.json({ success: true, message: 'Deleted', data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like video
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const video = mockData.videos.find(v => v._id === id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    video.likes = (video.likes || 0) + 1;
    res.json({ success: true, message: 'Liked', data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Unlike video
router.post('/:id/unlike', (req, res) => {
  try {
    const { id } = req.params;
    const video = mockData.videos.find(v => v._id === id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    video.likes = Math.max(0, (video.likes || 0) - 1);
    res.json({ success: true, message: 'Unliked', data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;