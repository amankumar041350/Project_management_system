import dbConnect from '@/lib/connectDB';
import Report from '@/models/Report';
import { NextResponse } from 'next/server';


export async function PUT(req, context) {
  const { id } =  context.params; // ✅ correctly accessing params

  try {
    await dbConnect();

    const form = await req.formData();

    const updatedData = {
      serialNo: form.get('serialNumber'),
      srfNumber: form.get('srfNumber'),
      srfDate: form.get('srfDate'),
      jobNumber: form.get('jobNumber'),
      jobDate: form.get('jobDate'),
      itemDescription: form.get('itemDescription'),
      testReportNumber: form.get('testReportNumber'),
      testReportDate: form.get('testReportDate'),
      adcDate: form.get('adcDate'),
    };

    const file = form.get('reportFile');
    if (file && typeof file === 'object' && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
      fs.writeFileSync(uploadPath, buffer);
      updatedData.reportFile = fileName;
    }

    const updatedReport = await Report.findByIdAndUpdate(id, updatedData, { new: true });

    return NextResponse.json({ message: 'Report updated', data: updatedReport });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ message: 'Failed to update report' }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  await dbConnect();
  await Report.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}


export async function GET(req, context) {
  const { params } = await context;
  const { id } = await params;

  try {
    await dbConnect();
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }
   
    return NextResponse.json({ data: report });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ message: 'Error fetching report' }, { status: 500 });
  }
}






