import cookie from 'js-cookie'
import { useRouter } from 'lib/router'
import { FC, useState } from 'react'
import { ChevronDown } from 'react-feather'
import { useIntl } from 'react-intl'

import HoverDropdown from './Dropdown/HoverDropdown'

type LanguageDropdownProps = {
  className?: string
  openDelay?: number
}

const alternatePath = (path: string, locale: string, targetLocale: string) => {
  if (path === `/${locale}`) {
    return `/${targetLocale}`
  }

  return path.replace(`/${locale}/`, `/${targetLocale}/`)
}

const LanguageDropdown: FC<LanguageDropdownProps> = ({
  className,
  openDelay = 500, // Add a delay of 500ms before opening
}) => {
  const router = useRouter()
  const { locale } = useIntl()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (targetLocale: string) => {
    if (targetLocale === locale) {
      setIsOpen(false)
      return
    }

    cookie.set('locale', targetLocale, { expires: 365 })
    const href = alternatePath(router.asPath, locale, targetLocale)
    window.location.href = href
    setIsOpen(false)
  }

  return (
    <HoverDropdown
      className={className}
      openDelay={openDelay}
      trigger={({ toggle }: { toggle: () => void }) => (
        <button
          className="flex items-center rounded px-2 py-1 font-black uppercase cursor-pointer"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {locale.toUpperCase()}
          <ChevronDown size={14} className="ml-1" />
        </button>
      )}
    >
      {({ close }: { close: () => void }) => (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray rounded shadow-md z-50 py-2">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={() => {
              handleLanguageChange('en')
              close()
            }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3">
              {locale === 'en' && (
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              )}
            </div>
            <span className="font-bold">ENGLISH - EN</span>
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={() => {
              handleLanguageChange('fr')
              close()
            }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3">
              {locale === 'fr' && (
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              )}
            </div>
            <span className="font-bold">FRANÇAIS - FR</span>
          </button>
        </div>
      )}
    </HoverDropdown>
  )
}

export default LanguageDropdown
