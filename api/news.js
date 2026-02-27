export default async function handler(req, res) {
  const API_KEY = process.env.NEWSAPI_KEY;

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=ph&apiKey=${API_KEY}`
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
