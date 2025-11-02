const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title:    { type: String, required: true, trim: true },
  type:     { type: String, enum: ['maintenance','repair','renovation'], default: 'maintenance', required: true },
  status:   { type: String, enum: ['planned','in-progress','completed','on-hold'], default: 'planned' },
  cost:     { type: Number, default: 0, min: 0 },
  startDate:{ type: Date },
  dueDate:  { type: Date },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);