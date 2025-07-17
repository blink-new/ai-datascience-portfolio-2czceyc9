import { Button } from './ui/button'
import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed top-6 right-6 z-40 md:right-auto md:left-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        className="glass border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-sm"
      >
        <Globe className="w-4 h-4 mr-2" />
        {language === 'en' ? 'ES' : 'EN'}
      </Button>
    </div>
  )
}