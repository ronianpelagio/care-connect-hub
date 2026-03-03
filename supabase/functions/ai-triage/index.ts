import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a medical triage AI assistant for a hospital. Based on the patient's symptoms, provide:
1. A brief assessment of their condition
2. The recommended hospital department
3. An urgency level: "routine", "priority", or "emergency"
4. Brief advice for the patient

IMPORTANT: You are NOT diagnosing. You are helping route the patient to the right department.
Always recommend they consult with a doctor for proper diagnosis.

Respond in JSON format:
{
  "assessment": "Brief description of likely condition",
  "recommended_department": "Department name",
  "urgency_level": "routine|priority|emergency",
  "advice": "Brief patient advice",
  "suggested_specialists": ["Specialist 1", "Specialist 2"]
}`
          },
          {
            role: "user",
            content: `Patient symptoms: ${JSON.stringify(symptoms)}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "triage_assessment",
              description: "Provide a triage assessment based on patient symptoms",
              parameters: {
                type: "object",
                properties: {
                  assessment: { type: "string", description: "Brief assessment of the condition" },
                  recommended_department: { type: "string", description: "Recommended hospital department" },
                  urgency_level: { type: "string", enum: ["routine", "priority", "emergency"] },
                  advice: { type: "string", description: "Brief patient advice" },
                  suggested_specialists: { type: "array", items: { type: "string" } }
                },
                required: ["assessment", "recommended_department", "urgency_level", "advice", "suggested_specialists"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "triage_assessment" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let result;
    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const content = data.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          assessment: "Unable to process symptoms. Please consult a doctor directly.",
          recommended_department: "General Medicine",
          urgency_level: "routine",
          advice: "Please visit the hospital for a proper assessment.",
          suggested_specialists: ["General Practitioner"]
        };
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("triage error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
