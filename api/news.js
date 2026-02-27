export default async function handler(req, res) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY; // set in Vercel env vars
  const url = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      return res.status(500).json({ error: data.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
