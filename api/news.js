// pages/api/news.js
export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?country=cn&apiKey=${API_KEY}&pageSize=20`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
