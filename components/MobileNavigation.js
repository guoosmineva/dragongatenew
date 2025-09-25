'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const navigationLinks = [
    { href: '/', label: t('home') },
    { href: '/catalog', label: t('catalog') },
    { href: '/trending', label: t('trending') },
    { href: '/blog', label: t('blog') }
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden border-red-500/30 text-red-500 hover:bg-red-500/20">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-black/90 backdrop-blur-sm border-white/20">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center">
            <Image 
              src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
              alt="GameVault Logo" 
              width={32} 
              height={32} 
              className="rounded mr-3"
            />
            GameVault
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {navigationLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-white hover:text-blue-300 transition-colors py-2 text-lg"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-white/20">
            <p className="text-gray-400 text-sm mb-3">Language / Bahasa</p>
            <LanguageSwitcher />
          </div>
          
          <div className="pt-4 space-y-3">
            <a 
              href="https://web.telegram.org/k/#@behemoth168?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              Telegram
            </a>
            <a 
              href="https://wa.me/62816339871?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}