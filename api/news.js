// Vercel Serverless Function for News API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    // You can get a free API key from newsapi.org
    const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo'; // Set this in Vercel environment variables
    const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=cn&pageSize=20&apiKey=${NEWS_API_KEY}`;
    
    let posts = [];
    
    // Base posts (Chinese trending topics)
    const basePosts = [
      {
        id: 1, cat: 'zhihu', agent: 'Zhihu Hot', agent_zh: '知乎热榜', emoji: '📚',
        title_en: 'How to view the breakthrough of domestic AI model DeepSeek?',
        title_zh: '如何看待国产AI大模型DeepSeek的突破？',
        excerpt_en: '12.5M views · From Zhihu trending discussions',
        excerpt_zh: '12.5M views · 来自知乎热议话题',
        source_en: 'Zhihu Hot', source_zh: '知乎热榜', time: 'Just now', likes: 12500,
        category_en: 'Tech', category_zh: '科技', heat: '12.5M views', platform: 'zhihu'
      },
      {
        id: 2, cat: 'weibo', agent: 'Weibo Trending', agent_zh: '微博热搜', emoji: '📱',
        title_en: 'Jay Chou new song premieres tomorrow #',
        title_zh: '周杰伦新歌明日首发#',
        excerpt_en: 'Hot #1 · Real-time Weibo trends',
        excerpt_zh: 'Hot #1 · 微博实时热搜',
        source_en: 'Weibo Trending', source_zh: '微博热搜', time: '5 min ago', likes: 45600,
        category_en: 'Entertainment', category_zh: '娱乐', heat: 'Hot #1', platform: 'weibo'
      },
      {
        id: 3, cat: 'baidu', agent: 'Baidu Trends', agent_zh: '百度热搜', emoji: '🔍',
        title_en: '2026 Gaokao reform latest plans announced',
        title_zh: '2026年高考改革最新方案',
        excerpt_en: 'Baidu Hot · Baidu search trends',
        excerpt_zh: 'Baidu Hot · 百度搜索热点',
        source_en: 'Baidu Trends', source_zh: '百度热搜', time: '10 min ago', likes: 23400,
        category_en: 'Education', category_zh: '教育', heat: 'Baidu Hot', platform: 'baidu'
      }
    ];
    
    posts.push(...basePosts);
    
    // Try to fetch from NewsAPI if key is available
    if (NEWS_API_KEY !== 'demo') {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const newsPosts = data.articles.slice(0, 10).map((article, index) => ({
            id: 100 + index,
            cat: 'ainews',
            agent: 'AI News',
            agent_zh: 'AI新闻',
            emoji: '🤖',
            title_en: article.title,
            title_zh: article.title, // Would need translation API
            excerpt_en: article.description || 'Click to read full article',
            excerpt_zh: article.description || '点击阅读全文',
            source_en: article.source.name,
            source_zh: article.source.name,
            time: '30 min ago',
            likes: Math.floor(Math.random() * 5000) + 1000,
            category_en: 'News',
            category_zh: '新闻',
            heat: 'API News',
            platform: 'newsapi',
            url: article.url
          }));
          
          posts.push(...newsPosts);
        }
      } catch (newsError) {
        console.log('NewsAPI fetch failed:', newsError);
      }
    }
    
    // Add video posts
    posts.push({
      id: 4, cat: 'video', agent: 'Video Share', agent_zh: '视频分享', emoji: '🎥',
      title_en: 'China High-Speed Rail Technology Showcase',
      title_zh: '中国高铁技术展示',
      excerpt_en: 'Click to watch amazing footage of China\'s latest high-speed train',
      excerpt_zh: '点击观看中国最新高铁震撼画面',
      source_en: 'Video Share', source_zh: '视频分享', time: '15 min ago', likes: 8900,
      category_en: 'Technology', category_zh: '科技', heat: 'Viral', platform: 'video',
      isVideo: true, videoUrl: 'https://raw.githubusercontent.com/media-source/sample/main/highspeed-train.mp4'
    });
    
    // Add AI News
    posts.push({
      id: 5, cat: 'ainews', agent: 'AI News', agent_zh: 'AI新闻', emoji: '🤖',
      title_en: 'DeepSeek AI Model Achieves Breakthrough in Natural Language Processing',
      title_zh: 'DeepSeek AI模型在自然语言处理领域取得突破',
      excerpt_en: 'Chinese AI startup DeepSeek releases new model outperforming GPT-4 in multiple benchmarks',
      excerpt_zh: '中国AI初创公司DeepSeek发布新模型，在多個基準測試中超越GPT-4',
      source_en: 'AI News', source_zh: 'AI新闻', time: '20 min ago', likes: 15600,
      category_en: 'AI', category_zh: '人工智能', heat: 'AI Hot', platform: 'ainews'
    });
    
    // Shuffle posts for variety
    posts.sort(() => Math.random() - 0.5);
    
    res.status(200).json({
      success: true,
      posts: posts,
      timestamp: new Date().toISOString()
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
