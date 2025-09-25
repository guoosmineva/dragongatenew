'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    catalog: 'Catalog',
    trending: 'Trending Games',
    blog: 'Blog',
    
    // Home Page
    discoverGames: 'Discover Amazing Games',
    ultimateDestination: 'Your ultimate destination for the best mobile and PC games. Explore our curated collection and find your next adventure.',
    browseCatalog: 'Browse Catalog',
    featuredGames: 'Featured Games',
    handpickedGames: 'Handpicked games just for you',
    latestArticles: 'Latest Articles',
    stayUpdated: 'Stay updated with gaming news and tips',
    viewAllGames: 'View All Games',
    viewAllArticles: 'View All Articles',
    
    // Game Cards
    downloads: 'downloads',
    viewGame: 'View Game',
    readMore: 'Read More',
    
    // Catalog Page
    gameCatalog: 'Game Catalog',
    exploreCollection: 'Explore our complete collection of games. Use the search and filters to find your perfect game.',
    searchPlaceholder: 'Search games by name...',
    filterByCategory: 'Filter by category',
    allCategories: 'All Categories',
    foundGames: 'Found',
    games: 'games',
    forQuery: 'for',
    inCategory: 'in',
    noGamesFound: 'No games found',
    tryAdjusting: 'Try adjusting your search or filter criteria',
    loading: 'Loading...',
    
    // Trending Page
    trendingGames: 'Trending Games',
    hottestGames: 'Discover the hottest games everyone\'s playing! These games are trending on TikTok Live and have the highest downloads.',
    trending: 'Trending',
    viewDetails: 'View Details',
    download: 'Download',
    
    // Blog Page
    gamingBlog: 'Gaming Blog',
    latestGamingNews: 'Stay updated with the latest gaming news, reviews, guides, and industry insights from our expert team.',
    readArticle: 'Read Article',
    minRead: 'min read',
    
    // Game Detail Page
    aboutGame: 'About This Game',
    downloadGame: 'Download Game',
    downloadNow: 'Download Now',
    gameInformation: 'Game Information',
    developer: 'Developer',
    version: 'Version',
    releaseDate: 'Release Date',
    requirements: 'Requirements',
    languages: 'Languages',
    needHelp: 'Need Help?',
    contactSupport: 'Contact us for support or questions about this game.',
    contactTelegram: 'Contact on Telegram',
    contactWhatsApp: 'Contact on WhatsApp',
    screenshots: 'Screenshots',
    reviews: 'reviews',
    fileSize: 'File Size',
    backToCatalog: 'Back to Catalog',
    gameNotFound: 'Game Not Found',
    gameNotExist: 'The game you\'re looking for doesn\'t exist or has been removed.',
    
    // Article Detail Page
    shareArticle: 'Share this article',
    helpOthers: 'Help others discover great gaming content',
    backToBlog: 'Back to Blog',
    articleNotFound: 'Article Not Found',
    articleNotExist: 'The article you\'re looking for doesn\'t exist or has been removed.',
    share: 'Share',
    
    // Footer
    allRightsReserved: 'All rights reserved.',
    navigation: 'Navigation',
    contact: 'Contact',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Categories
    Action: 'Action',
    RPG: 'RPG',
    Strategy: 'Strategy',
    Adventure: 'Adventure',
    Simulation: 'Simulation',
    Puzzle: 'Puzzle',
  },
  id: {
    // Navigation
    home: 'Beranda',
    catalog: 'Katalog',
    trending: 'Game Trending',
    blog: 'Blog',
    
    // Home Page
    discoverGames: 'Temukan Game Menakjubkan',
    ultimateDestination: 'Destinasi utama Anda untuk game mobile dan PC terbaik. Jelajahi koleksi kurasi kami dan temukan petualangan berikutnya.',
    browseCatalog: 'Jelajahi Katalog',
    featuredGames: 'Game Unggulan',
    handpickedGames: 'Game pilihan khusus untuk Anda',
    latestArticles: 'Artikel Terbaru',
    stayUpdated: 'Tetap update dengan berita dan tips gaming',
    viewAllGames: 'Lihat Semua Game',
    viewAllArticles: 'Lihat Semua Artikel',
    
    // Game Cards
    downloads: 'unduhan',
    viewGame: 'Lihat Game',
    readMore: 'Baca Selengkapnya',
    
    // Catalog Page
    gameCatalog: 'Katalog Game',
    exploreCollection: 'Jelajahi koleksi lengkap game kami. Gunakan pencarian dan filter untuk menemukan game yang sempurna.',
    searchPlaceholder: 'Cari game berdasarkan nama...',
    filterByCategory: 'Filter berdasarkan kategori',
    allCategories: 'Semua Kategori',
    foundGames: 'Ditemukan',
    games: 'game',
    forQuery: 'untuk',
    inCategory: 'dalam kategori',
    noGamesFound: 'Tidak ada game ditemukan',
    tryAdjusting: 'Coba sesuaikan kriteria pencarian atau filter Anda',
    loading: 'Memuat...',
    
    // Trending Page
    trendingGames: 'Game Trending',
    hottestGames: 'Temukan game terpanas yang sedang dimainkan semua orang! Game ini trending di TikTok Live dan memiliki unduhan tertinggi.',
    trending: 'Trending',
    viewDetails: 'Lihat Detail',
    download: 'Unduh',
    
    // Blog Page
    gamingBlog: 'Blog Gaming',
    latestGamingNews: 'Tetap update dengan berita gaming terbaru, review, panduan, dan wawasan industri dari tim ahli kami.',
    readArticle: 'Baca Artikel',
    minRead: 'menit baca',
    
    // Game Detail Page
    aboutGame: 'Tentang Game Ini',
    downloadGame: 'Unduh Game',
    downloadNow: 'Unduh Sekarang',
    gameInformation: 'Informasi Game',
    developer: 'Pengembang',
    version: 'Versi',
    releaseDate: 'Tanggal Rilis',
    requirements: 'Persyaratan',
    languages: 'Bahasa',
    needHelp: 'Butuh Bantuan?',
    contactSupport: 'Hubungi kami untuk dukungan atau pertanyaan tentang game ini.',
    contactTelegram: 'Hubungi via Telegram',
    contactWhatsApp: 'Hubungi via WhatsApp',
    screenshots: 'Screenshot',
    reviews: 'ulasan',
    fileSize: 'Ukuran File',
    backToCatalog: 'Kembali ke Katalog',
    gameNotFound: 'Game Tidak Ditemukan',
    gameNotExist: 'Game yang Anda cari tidak ada atau telah dihapus.',
    
    // Article Detail Page
    shareArticle: 'Bagikan artikel ini',
    helpOthers: 'Bantu orang lain menemukan konten gaming yang bagus',
    backToBlog: 'Kembali ke Blog',
    articleNotFound: 'Artikel Tidak Ditemukan',
    articleNotExist: 'Artikel yang Anda cari tidak ada atau telah dihapus.',
    share: 'Bagikan',
    
    // Footer
    allRightsReserved: 'Hak cipta dilindungi.',
    navigation: 'Navigasi',
    contact: 'Kontak',
    legal: 'Legal',
    privacyPolicy: 'Kebijakan Privasi',
    termsOfService: 'Syarat Layanan',
    
    // Categories
    Action: 'Aksi',
    RPG: 'RPG',
    Strategy: 'Strategi',
    Adventure: 'Petualangan',
    Simulation: 'Simulasi',
    Puzzle: 'Puzzle',
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('id') // Default to Indonesian

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('gameVaultLanguage')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('gameVaultLanguage', lang)
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}