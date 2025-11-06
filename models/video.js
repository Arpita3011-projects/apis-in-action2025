const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String },
  videoUrl: { type: String },
  thumbnail: { type: String },
  duration: { type: String },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

VideoSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model('Video', VideoSchema);