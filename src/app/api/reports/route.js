import dbConnect from '@/lib/connectDB';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const reports = await Report.find().sort({ serialNo: 1 });
  return Response.json({ success: true, data: reports });
}

export async function POST(req) {
  try {
    await dbConnect();

    const form = await req.formData();
    console.log(form.serialNo)
    const newReport = new Report({
      serialNo: form.get('serialNumber'),
      srfNumber: form.get('srfNumber'),
      srfDate: form.get('srfDate'),
      jobNumber: form.get('jobNumber'),
      jobDate: form.get('jobDate'),
      itemDescription: form.get('itemDescription'),
      testReportNumber: form.get('testReportNumber'),
      testReportDate: form.get('testReportDate'),
      adcDate: form.get('adcDate'),
    });

    const file = form.get('reportFile');
    if (file && typeof file === 'object' && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      newReport.reportFile = fileName;
    }

    await newReport.save();

    return NextResponse.json({ message: 'Report added successfully', data: newReport });
  } catch (err) {
    console.error('Error adding report:', err);
    return NextResponse.json({ message: 'Failed to add report' }, { status: 500 });
  }
}