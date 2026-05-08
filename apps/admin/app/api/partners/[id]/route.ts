import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../src/lib/supabase';
import type { Partner, PartnerInput } from '../../../../src/types/partner';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseClient();
  const { id } = await params;
  const { data, error } = await supabase
    .from('partners')
    .select(`
      *,
      listings:listings(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const partner: Partner = {
    ...data,
    listing_count: data.listings?.[0]?.count ?? 0,
  };

  return NextResponse.json(partner);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseClient();
  const { id } = await params;
  const body: Partial<PartnerInput> = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.contact_name !== undefined) updateData.contact_name = body.contact_name;
  if (body.contact_email !== undefined) updateData.contact_email = body.contact_email;
  if (body.website !== undefined) updateData.website = body.website;
  if (body.workshop_status !== undefined) updateData.workshop_status = body.workshop_status;
  if (body.notes !== undefined) updateData.notes = body.notes;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('partners')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      listings:listings(count)
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const partner: Partner = {
    ...data,
    listing_count: data.listings?.[0]?.count ?? 0,
  };

  return NextResponse.json(partner);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseClient();
  const { id } = await params;
  const { count, error: countError } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count && count > 0) {
    return NextResponse.json(
      { error: 'Cannot delete partner with active listings. Remove listings first.' },
      { status: 409 },
    );
  }

  const { error } = await supabase.from('partners').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
