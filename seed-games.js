const gamesData = [
  {
    title: 'Wukong',
    description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.',
    category: 'Action',
    downloadUrl: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip',
    featured: true,
    downloads: 125000
  },
  {
    title: 'Call Me Champion',
    description: 'Intense competitive fighting game where you battle to become the ultimate champion. Master various fighting styles and defeat opponents in epic tournaments.',
    category: 'Action',
    downloadUrl: 'https://goc-cdn.qqby.cn/jwgj/ChampionTK_2.2.2.zip',
    featured: true,
    downloads: 89000
  },
  {
    title: 'Dragonball Showdown',
    description: 'High-energy fighting game featuring your favorite Dragon Ball characters. Unleash devastating attacks and experience the ultimate anime fighting experience.',
    category: 'Action',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/lzTK/DragonBall_tk_v1.0.3.zip',
    featured: true,
    downloads: 156000
  },
  {
    title: 'Jiang Hu',
    description: 'Immersive martial arts RPG set in ancient China. Master kung fu techniques, explore vast landscapes, and forge your legend in the world of martial arts.',
    category: 'RPG',
    downloadUrl: 'https://goc-cdn.qqby.cn/jh/JiangHu_tk_v1.0.18.zip',
    featured: false,
    downloads: 67000
  },
  {
    title: 'Civilization',
    description: 'Build and expand your empire through the ages. Develop technologies, wage wars, and lead your civilization to greatness in this epic strategy game.',
    category: 'Strategy',
    downloadUrl: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip',
    featured: true,
    downloads: 234000
  },
  {
    title: 'Wulin: King of War',
    description: 'Strategic warfare game combining martial arts with tactical combat. Lead your army of warriors and conquer territories in ancient battlefields.',
    category: 'Strategy',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/crawler_tk/KingWar_tk_v1.0.33.zip',
    featured: false,
    downloads: 92000
  },
  {
    title: 'Game Peta',
    description: 'Strategic puzzle game that challenges your mind. Plan your moves carefully and outsmart your opponents in this engaging strategy experience.',
    category: 'Strategy',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/sglzTK/SgltTK_1.0.4.zip',
    featured: false,
    downloads: 43000
  },
  {
    title: 'Color Fortress',
    description: 'Defend your colorful fortress in this strategic tower defense game. Build defenses, upgrade your fortress, and repel waves of invaders.',
    category: 'Strategy',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/scbl/scblTT_1.0.34.zip',
    featured: false,
    downloads: 78000
  },
  {
    title: 'Crown Fight',
    description: 'Battle for the crown in this intense action-packed combat game. Fight through challenging opponents and claim your rightful place as ruler.',
    category: 'Action',
    downloadUrl: 'https://goc-cdn.qqby.cn/crawler_tk/CrownFight_tk_v1.0.26.zip',
    featured: false,
    downloads: 112000
  },
  {
    title: 'Cheese Wars',
    description: 'Embark on a whimsical adventure in the world of cheese! Navigate through fun challenges and obstacles in this delightful family-friendly game.',
    category: 'Adventure',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/QosTT/Release/QosTT_1.0.19.zip',
    featured: false,
    downloads: 95000
  },
  {
    title: 'Clash of Clans',
    description: 'The classic strategy game where you build your village, train troops, and battle other players. Join clans and participate in epic clan wars.',
    category: 'Strategy',
    downloadUrl: 'https://qqby-goc-hk.oss-cn-hongkong.aliyuncs.com/blct/blctTT_1.0.10.zip',
    featured: true,
    downloads: 456000
  },
  {
    title: 'Minions',
    description: 'Join the lovable Minions on their hilarious adventure! Experience fun-filled gameplay with your favorite yellow characters in this family game.',
    category: 'Adventure',
    downloadUrl: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
    featured: false,
    downloads: 187000
  },
  {
    title: 'The Sheep Village',
    description: 'Build and manage your own peaceful sheep village. Take care of your flock, expand your farm, and create the perfect pastoral paradise.',
    category: 'Simulation',
    downloadUrl: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
    featured: false,
    downloads: 134000
  }
]

async function seedGames() {
  const STRAPI_URL = 'http://localhost:1337'
  
  console.log('Starting to seed games data...')

  for (let i = 0; i < gamesData.length; i++) {
    const game = gamesData[i]
    
    try {
      console.log(`Creating game ${i + 1}/${gamesData.length}: ${game.title}`)
      
      const response = await fetch(`${STRAPI_URL}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...game,
            slug: game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
            publishedAt: new Date().toISOString()
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✓ Created: ${game.title}`)
      } else {
        const error = await response.text()
        console.log(`✗ Failed to create ${game.title}: ${error}`)
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.log(`✗ Error creating ${game.title}:`, error.message)
    }
  }
  
  console.log('Finished seeding games!')
}

// Run the seeding
seedGames().catch(console.error)