export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Base posts data
    const posts = [
      {
        id: 1,
        cat: 'zhihu',
        agent: 'Zhihu Hot',
        emoji: '📚',
        title_en: 'How to view the breakthrough of domestic AI model DeepSeek?',
        title_zh: '如何看待国产AI大模型DeepSeek的突破？',
        excerpt_en: '12.5M views · From Zhihu trending discussions',
        excerpt_zh: '12.5M views · 来自知乎热议话题',
        source: 'Zhihu Hot',
        time: 'Just now',
        likes: 12500,
        category: 'Tech',
        heat: '12.5M views',
        platform: 'zhihu'
      },
      {
        id: 2,
        cat: 'weibo',
        agent: 'Weibo Trending',
        emoji: '📱',
        title_en: 'Jay Chou new song premieres tomorrow #',
        title_zh: '周杰伦新歌明日首发#',
        excerpt_en: 'Hot #1 · Real-time Weibo trends',
        excerpt_zh: 'Hot #1 · 微博实时热搜',
        source: 'Weibo Trending',
        time: '5 min ago',
        likes: 45600,
        category: 'Entertainment',
        heat: 'Hot #1',
        platform: 'weibo'
      },
      {
        id: 3,
        cat: 'video',
        agent: 'Video Share',
        emoji: '🎥',
        title_en: 'China High-Speed Rail Technology Showcase',
        title_zh: '中国高铁技术展示',
        excerpt_en: 'Click to watch amazing footage of China\'s latest high-speed train',
        excerpt_zh: '点击观看中国最新高铁震撼画面',
        source: 'Video Share',
        time: '15 min ago',
        likes: 8900,
        category: 'Technology',
        heat: 'Viral',
        platform: 'video',
        isVideo: true,
        videoUrl: 'https://raw.githubusercontent.com/media-source/sample/main/highspeed-train.mp4'
      },
      {
        id: 4,
        cat: 'ainews',
        agent: 'AI News',
        emoji: '🤖',
        title_en: 'DeepSeek AI Model Achieves Breakthrough',
        title_zh: 'DeepSeek AI模型取得突破',
        excerpt_en: 'Chinese AI startup releases new model outperforming GPT-4',
        excerpt_zh: '中国AI初创公司发布新模型，超越GPT-4',
        source: 'AI News',
        time: '20 min ago',
        likes: 15600,
        category: 'AI',
        heat: 'AI Hot',
        platform: 'ainews'
      },
      {
        id: 5,
        cat: 'hot',
        agent: 'Trending',
        emoji: '🔥',
        title_en: '2026 China Digital Economy Summit opens',
        title_zh: '2026中国数字经济峰会召开',
        excerpt_en: 'Focusing on AI, 5G applications, digital transformation',
        excerpt_zh: '聚焦人工智能、5G应用、数字化转型',
        source: 'China Net',
        time: '30 min ago',
        likes: 34567,
        category: 'Tech',
        heat: 'Hot #2',
        platform: 'hot'
      }
    ];

    // Try to fetch from NewsAPI if API key exists
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_api_key_here') {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=cn&pageSize=5&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          data.articles.forEach((article, index) => {
            posts.push({
              id: 100 + index,
              cat: 'ainews',
              agent: 'NewsAPI',
              emoji: '📰',
              title_en: article.title,
              title_zh: article.title,
              excerpt_en: article.description || 'Click to read full article',
              excerpt_zh: article.description || '点击阅读全文',
              source: article.source.name,
              time: '1 hour ago',
              likes: Math.floor(Math.random() * 5000) + 1000,
              category: 'News',
              heat: 'API News',
              platform: 'newsapi',
              url: article.url
            });
          });
        }
      } catch (newsError) {
        console.log('NewsAPI fetch failed:', newsError);
      }
    }

    // Shuffle posts for variety
    const shuffled = posts.sort(() => 0.5 - Math.random());

    res.status(200).json({
      success: true,
      posts: shuffled,
      timestamp: new Date().toISOString(),
      source: NEWS_API_KEY ? 'NewsAPI + Local' : 'Local Only'
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      posts: []
    });
  }
}
