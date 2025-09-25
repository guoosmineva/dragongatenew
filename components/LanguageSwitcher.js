'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('en')}
        className={`flex items-center space-x-2 ${
          language === 'en' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'border-white/20 text-white hover:bg-white/10'
        }`}
      >
        <Image
          src="https://flagcdn.com/w20/us.png"
          alt="English"
          width={20}
          height={15}
          className="rounded-sm"
        />
        <span className="text-xs">EN</span>
      </Button>
      
      <Button
        variant={language === 'id' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('id')}
        className={`flex items-center space-x-2 ${
          language === 'id' 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'border-white/20 text-white hover:bg-white/10'
        }`}
      >
        <Image
          src="https://flagcdn.com/w20/id.png"
          alt="Indonesian"
          width={20}
          height={15}
          className="rounded-sm"
        />
        <span className="text-xs">ID</span>
      </Button>
    </div>
  )
}