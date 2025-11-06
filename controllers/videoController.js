const asyncHandler = require('express-async-handler');
const Video = require('../models/video');

// Create video (admin)
exports.createVideo = asyncHandler(async (req, res) => {
  const { title, content, videoUrl, thumbnail, duration } = req.body;
  if (!title) return res.status(400).json({ success:false, message:'Title required' });
  const video = await Video.create({ title, content, videoUrl, thumbnail, duration });
  res.status(201).json({ success:true, message:'Video added', data: video });
});

// Get videos with search & pagination
exports.getVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, search } = req.query;
  page = parseInt(page); limit = parseInt(limit);

  const query = {};
  if (search) query.$or = [ { title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } } ];

  const total = await Video.countDocuments(query);
  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success:true, page, limit, totalPages: Math.ceil(total/limit), total, data: videos });
});

// Get single by id or slug
exports.getVideo = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const video = await Video.findOne({ $or: [ { _id: idOrSlug }, { slug: idOrSlug } ] });
  if (!video) return res.status(404).json({ success:false, message:'Video not found' });
  res.json({ success:true, data: video });
});

// Update (admin)
exports.updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndUpdate(id, req.body, { new: true });
  if (!video) return res.status(404).json({ success:false, message:'Not found' });
  res.json({ success:true, message:'Updated', data: video });
});

// Delete (admin)
exports.deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findByIdAndDelete(id);
  if (!video) return res.status(404).json({ success:false, message:'Not found' });
  res.json({ success:true, message:'Deleted', data: video });
});

// Like
exports.likeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ success:false, message:'Not found' });
  video.likes = (video.likes || 0) + 1;
  await video.save();
  res.json({ success:true, message:'Liked', data: video });
});

// Unlike (decrement safely)
exports.unlikeVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ success:false, message:'Not found' });
  video.likes = Math.max(0, (video.likes || 0) - 1);
  await video.save();
  res.json({ success:true, message:'Unliked', data: video });
});