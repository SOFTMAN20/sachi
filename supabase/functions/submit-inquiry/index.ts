// ============================================================================
// submit-inquiry — a renter sends an inquiry about a property.
//
// Creates a lead row (owner_id is resolved server-side from the property so the
// client can't spoof it) using the service-role key, then returns the new lead.
// POST { propertyId, name, message, source?, renterId? }
// ============================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { propertyId, name, message, source, renterId } = await req.json();

    if (!propertyId || !name) {
      return jsonResponse({ error: 'propertyId and name are required' }, 400);
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Resolve the property's owner so the lead is attributed correctly.
    const { data: property, error: propErr } = await admin
      .from('properties')
      .select('id, owner_id, title')
      .eq('id', propertyId)
      .single();

    if (propErr || !property) {
      return jsonResponse({ error: 'Property not found' }, 404);
    }

    const { data: lead, error: leadErr } = await admin
      .from('leads')
      .insert({
        property_id: property.id,
        owner_id: property.owner_id,
        renter_id: renterId ?? null,
        name,
        message: message ?? '',
        source: source ?? 'Sachi App',
        status: 'new',
      })
      .select()
      .single();

    if (leadErr) {
      return jsonResponse({ error: leadErr.message }, 400);
    }

    // (Hook point: notify the owner via SMS / push here.)

    return jsonResponse({ lead }, 201);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
