import { NextResponse } from 'next/server';
import { getApiDiagnostics } from '../../../lib/parcel-api';

export async function GET() {
  const diagnostics = await getApiDiagnostics();
  return NextResponse.json(diagnostics);
}