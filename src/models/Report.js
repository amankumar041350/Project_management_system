import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    serialNo: { type: Number, required: true },
    srfNumber: { type: String, required: true },
    srfDate: { type: Date, required: true },
    jobNumber: { type: String, required: true },
    jobDate: { type: Date, required: true },
    itemDescription: { type: String, required: true },
    testReportNumber: { type: String, required: true },
    testReportDate: { type: Date, required: true },
    adcDate: { type: Date, required: true },
    reportFileUrl: { type: String }, // File upload URL or file name
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model('Report', reportSchema);
