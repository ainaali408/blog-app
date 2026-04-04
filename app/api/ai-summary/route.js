export async function POST(req) {
    try {
        const { content } = await req.json();

        const res = await fetch(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: content,
                }),
            }
        );

        // ✅ Handle non-JSON errors safely
        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return Response.json(
                { error: "Invalid response from HF" },
                { status: 500 }
            );
        }

        console.log("HF DATA:", data);

        return Response.json({
            summary: data?.[0]?.summary_text || "No summary",
        });

    } catch (error) {
        console.log("ERROR:", error);

        return Response.json(
            { error: "HF failed" },
            { status: 500 }
        );
    }
}