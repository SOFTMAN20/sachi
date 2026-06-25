// ============================================================================
// dashboard-stats — aggregated KPIs for the signed-in owner / agent.
//
// Uses the caller's JWT (forwarded Authorization header) so RLS naturally
// scopes every query to the authenticated user. Returns lead counts by stage,
// conversion rate, deals closed, commission earned, active listings.
// ============================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return jsonResponse({ error: 'Not authenticated' }, 401);
  }

  // RLS restricts these to the caller's own rows.
  const [{ data: leads }, { data: commissions }, { count: activeListings }] =
    await Promise.all([
      supabase.from('leads').select('status'),
      supabase.from('commissions').select('amount, status'),
      supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

  const leadRows = leads ?? [];
  const totalLeads = leadRows.length;
  const byStage = leadRows.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});
  const dealsClosed = byStage['closed'] ?? 0;
  const conversionRate = totalLeads ? Math.round((dealsClosed / totalLeads) * 100) : 0;

  const commissionEarned = (commissions ?? [])
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return jsonResponse({
    totalLeads,
    byStage,
    dealsClosed,
    conversionRate,
    commissionEarned,
    activeListings: activeListings ?? 0,
  });
});
