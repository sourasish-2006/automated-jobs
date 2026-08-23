import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const tenantId = 'tenant_prod_enterprise_1';
  const logs = db.auditLogs.filter(l => l.tenantId === tenantId);
  return NextResponse.json({
    success: true,
    logs
  });
}
