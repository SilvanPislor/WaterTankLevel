
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    try {
        if (req.method === "POST") {
            const { listName, list } = req.body;
            console.log(list);
        
            const { error } = await supabase
                .from("lists")
                .upsert([{ name: listName, data: list }], { onConflict: "name" });
        
            if (error) throw error;
        
            return res.status(200).json({ success: true, message: `List "${listName}" saved!` });
        }

        if (req.method === "GET") {
            const { listName } = req.query;
            if (!listName) {
                return res.status(400).json({ error: "Missing list name" });
            }

            const { data, error } = await supabase
                .from("lists")
                .select("data")
                .eq("name", listName)
                .single();

            if (error) throw error;
            console.log(data);
            return res.status(200).json({ list: data ? data.data : [] });

        }

        res.status(405).json({ error: "Method Not Allowed" });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
