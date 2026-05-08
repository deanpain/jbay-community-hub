import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../src/lib/supabase';
import type { Partner, PartnerInput } from '../../../src/types/partner';

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('partners')
    .select(`
      *,
      listings:listings(count)
    `)
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const partners: Partner[] = (data || []).map((partner: any) => ({
    ...partner,
    listing_count: partner.listings?.[0]?.count ?? 0,
  }));

  return NextResponse.json(partners);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  const body: PartnerInput = await request.json();

  const { data, error } = await supabase
    .from('partners')
    .insert([
      {
        name: body.name,
        type: body.type,
        contact_name: body.contact_name,
        contact_email: body.contact_email,
        website: body.website,
        workshop_status: body.workshop_status,
        notes: body.notes,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
