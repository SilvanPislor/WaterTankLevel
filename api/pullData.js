import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            // Optional: Add query parameter support for limiting results (e.g., ?limit=100)
            const limit = parseInt(req.query.limit) || 200;

            const { data, error } = await supabase
                .from("water_levels")
                .select("level, created_at")
                .order("created_at", { ascending: false }) // <-- newest first
                .limit(limit);

            if (error) throw error;

            return res.status(200).json({ levels: data });
        }

        res.status(405).json({ error: "Method Not Allowed" });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
