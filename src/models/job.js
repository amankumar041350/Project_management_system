// models/Job.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  stickerNumber: String,
  jobNumber: String,
  srfNumber: String,
  dateOfReceiving: Date,
  jobDescription: [
    {
      item: String,
      model: String,
      serialNo: String,
      make: String,
    },
  ],
  pdcDate: Date,
  adcDate: Date,
  startDate: Date,
  endDate: Date,
  reportDate: Date,
  certificateNumber: String,
  cycleNumber: Number,
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);