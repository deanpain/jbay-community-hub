import { CreatePartnerButton } from '../components/CreatePartnerButton';
import { PartnersTable } from '../components/PartnersTable';
import { getSupabaseClient } from '../../src/lib/supabase';

export const dynamic = 'force-dynamic';

async function getPartners() {
  const supabase = getSupabaseClient();
  const { data: partners, error } = await supabase
    .from('partners')
    .select(`
      *,
      listings:listings(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }

  return partners.map(partner => ({
    ...partner,
    listing_count: partner.listings?.[0]?.count || 0,
  }));
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="mt-2 text-gray-600">Manage partner organizations and workshop status</p>
        </div>

        <div className="mb-4 flex justify-end">
          <CreatePartnerButton />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <PartnersTable partners={partners} />
        </div>
      </div>
    </div>
  );
}
