export const handleGoogleSubmit = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  setError(null);
  setLoading(true);
  setHistory([...history, { type: "user", text: query }]);

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: query,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const answer =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";
    setResponse(answer);
    setHistory((prev) => [...prev, { type: "ai", text: answer }]);
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
    setQuery("");
  }
};

export const handleXaiSubmit = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  setError(null);
  setLoading(true);
  setHistory([...history, { type: "user", text: query }]);

  try {
    const res = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: "You are a test assistant.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        model: "grok-beta", // Choose model for XAI API
        stream: false,
        temperature: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_XAI_API_KEY}`, // XAI API Key
        },
      }
    );

    const answer =
      res?.choices?.[0]?.message?.content || "No response received.";
    setResponse(answer);
    setHistory((prev) => [...prev, { type: "ai", text: answer }]);
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
    setQuery("");
  }
};
