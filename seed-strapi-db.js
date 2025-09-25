const { Client } = require('pg');

const gamesData = [
  {
    title: 'Wukong',
    description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.',
    category: 'Action',
    download_url: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip',
    slug: 'wukong',
    featured: true,
    downloads: 125000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Call Me Champion',
    description: 'Intense competitive fighting game where you battle to become the ultimate champion. Master various fighting styles and defeat opponents in epic tournaments.',
    category: 'Action',
    download_url: 'https://goc-cdn.qqby.cn/jwgj/ChampionTK_2.2.2.zip',
    slug: 'call-me-champion',
    featured: true,
    downloads: 89000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Dragonball Showdown',
    description: 'High-energy fighting game featuring your favorite Dragon Ball characters. Unleash devastating attacks and experience the ultimate anime fighting experience.',
    category: 'Action',
    download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/lzTK/DragonBall_tk_v1.0.3.zip',
    slug: 'dragonball-showdown',
    featured: true,
    downloads: 156000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Jiang Hu',
    description: 'Immersive martial arts RPG set in ancient China. Master kung fu techniques, explore vast landscapes, and forge your legend in the world of martial arts.',
    category: 'RPG',
    download_url: 'https://goc-cdn.qqby.cn/jh/JiangHu_tk_v1.0.18.zip',
    slug: 'jiang-hu',
    featured: false,
    downloads: 67000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Civilization',
    description: 'Build and expand your empire through the ages. Develop technologies, wage wars, and lead your civilization to greatness in this epic strategy game.',
    category: 'Strategy',
    download_url: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip',
    slug: 'civilization',
    featured: true,
    downloads: 234000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Wulin: King of War',
    description: 'Strategic warfare game combining martial arts with tactical combat. Lead your army of warriors and conquer territories in ancient battlefields.',
    category: 'Strategy',
    download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/crawler_tk/KingWar_tk_v1.0.33.zip',
    slug: 'wulin-king-of-war',
    featured: false,
    downloads: 92000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Game Peta',
    description: 'Strategic puzzle game that challenges your mind. Plan your moves carefully and outsmart your opponents in this engaging strategy experience.',
    category: 'Strategy',
    download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/sglzTK/SgltTK_1.0.4.zip',
    slug: 'game-peta',
    featured: false,
    downloads: 43000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Color Fortress',
    description: 'Defend your colorful fortress in this strategic tower defense game. Build defenses, upgrade your fortress, and repel waves of invaders.',
    category: 'Strategy',
    download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/scbl/scblTT_1.0.34.zip',
    slug: 'color-fortress',
    featured: false,
    downloads: 78000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Crown Fight',
    description: 'Battle for the crown in this intense action-packed combat game. Fight through challenging opponents and claim your rightful place as ruler.',
    category: 'Action',
    download_url: 'https://goc-cdn.qqby.cn/crawler_tk/CrownFight_tk_v1.0.26.zip',
    slug: 'crown-fight',
    featured: false,
    downloads: 112000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Cheese Wars',
    description: 'Embark on a whimsical adventure in the world of cheese! Navigate through fun challenges and obstacles in this delightful family-friendly game.',
    category: 'Adventure',
    download_url: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/QosTT/Release/QosTT_1.0.19.zip',
    slug: 'cheese-wars',
    featured: false,
    downloads: 95000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Clash of Clans',
    description: 'The classic strategy game where you build your village, train troops, and battle other players. Join clans and participate in epic clan wars.',
    category: 'Strategy',
    download_url: 'https://qqby-goc-hk.oss-cn-hongkong.aliyuncs.com/blct/blctTT_1.0.10.zip',
    slug: 'clash-of-clans',
    featured: true,
    downloads: 456000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'Minions',
    description: 'Join the lovable Minions on their hilarious adventure! Experience fun-filled gameplay with your favorite yellow characters in this family game.',
    category: 'Adventure',
    download_url: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
    slug: 'minions',
    featured: false,
    downloads: 187000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    title: 'The Sheep Village',
    description: 'Build and manage your own peaceful sheep village. Take care of your flock, expand your farm, and create the perfect pastoral paradise.',
    category: 'Simulation',
    download_url: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
    slug: 'sheep-village',
    featured: false,
    downloads: 134000,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  }
]

async function seedDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'game_catalog_db',
    user: 'strapi_user',
    password: 'secure_password_123',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Check if games table exists and what its structure is
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'games' 
      ORDER BY ordinal_position;
    `);

    console.log('Games table structure:');
    console.log(tableInfo.rows);

    // Clear existing games
    await client.query('DELETE FROM games');
    console.log('Cleared existing games');

    // Insert games
    for (let i = 0; i < gamesData.length; i++) {
      const game = gamesData[i];
      try {
        const result = await client.query(`
          INSERT INTO games (
            title, description, category, download_url, slug, 
            featured, downloads, published_at, created_at, updated_at, locale
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `, [
          game.title, game.description, game.category, game.download_url, 
          game.slug, game.featured, game.downloads, game.published_at,
          game.created_at, game.updated_at, game.locale
        ]);
        console.log(`✓ Inserted game: ${game.title}`);
      } catch (error) {
        console.log(`✗ Failed to insert ${game.title}:`, error.message);
      }
    }

    // Check final count
    const count = await client.query('SELECT COUNT(*) FROM games');
    console.log(`\n✅ Total games in database: ${count.rows[0].count}`);

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

// Run the seeding
seedDatabase();