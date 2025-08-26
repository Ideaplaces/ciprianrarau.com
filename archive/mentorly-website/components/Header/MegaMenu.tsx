import classNames from 'classnames'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { ChevronDown } from 'react-feather'

import type { DropdownItem, DropdownSection } from './menuData'
import { productSections, resourceSections, solutionSections } from './menuData'

type MegaMenuProps = {
  className?: string
  mobileOnly?: boolean
}

const DropdownMenuItem: FC<{
  item: DropdownItem
  onClose: () => void
}> = ({ item, onClose }) => (
  <Link href={item.href}>
    <a
      className="block py-1 px-1 hover:bg-gray-50 transition-colors duration-150 group rounded"
      onClick={onClose}
    >
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
          {item.label}
        </span>
        {item.isNew && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            New
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-600">
          {item.description}
        </p>
      )}
    </a>
  </Link>
)

const MenuSection: FC<{
  section: DropdownSection
  onClose: () => void
}> = ({ section, onClose }) => (
  <div className="flex-1 min-w-56">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 whitespace-nowrap">
      {section.title}
    </h3>
    <div className="space-y-1">
      {section.items.map((item, index) => (
        <DropdownMenuItem key={index} item={item} onClose={onClose} />
      ))}
    </div>
  </div>
)

const MegaDropdown: FC<{
  sections: DropdownSection[]
  isOpen: boolean
  onClose: () => void
}> = ({ sections, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 rounded-md z-50">
      <div className="px-6 py-4">
        <div className="flex gap-6">
          {sections.map((section, index) => (
            <MenuSection key={index} section={section} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  )
}

const MegaMenu: FC<MegaMenuProps> = ({ className, mobileOnly = false }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [clickedDropdown, setClickedDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedMobileSection, setExpandedMobileSection] = useState<
    string | null
  >(null)

  const handleMouseEnter = (dropdown: string) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    // Only set active if not already clicked open
    if (!clickedDropdown) {
      setActiveDropdown(dropdown)
    }
  }

  const handleMouseLeave = () => {
    // Don't hide if opened by click
    if (clickedDropdown) return

    // Add delay before hiding on mouse leave
    const id = setTimeout(() => {
      setActiveDropdown(null)
      setTimeoutId(null)
    }, 300)
    setTimeoutId(id)
  }

  const handleMenuClick = (dropdown: string) => {
    if (clickedDropdown === dropdown) {
      // Clicking same menu closes it
      setClickedDropdown(null)
      setActiveDropdown(null)
    } else {
      // Clicking different menu opens it persistently
      setClickedDropdown(dropdown)
      setActiveDropdown(dropdown)
    }
    // Clear any hover timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  const closeDropdown = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setActiveDropdown(null)
    setClickedDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clickedDropdown) {
        // Check if click is outside the menu
        const target = event.target as Element
        if (!target.closest('[data-mega-menu]')) {
          setClickedDropdown(null)
          setActiveDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clickedDropdown])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setExpandedMobileSection(null)
  }

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSection(expandedMobileSection === section ? null : section)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  if (mobileOnly) {
    return (
      <>
        <button
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={toggleMobileMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-white shadow-lg z-50 overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="font-bold text-xl">MENTORLY</div>
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* Product Section */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
                  onClick={() => toggleMobileSection('product')}
                >
                  Product
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobileSection === 'product' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedMobileSection === 'product' && (
                  <div className="mt-2 space-y-3">
                    {productSections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {section.title}
                        </h4>
                        {section.items.map((item, itemIndex) => (
                          <Link href={item.href} key={itemIndex}>
                            <a
                              className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                              {item.isNew && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </a>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Section */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
                  onClick={() => toggleMobileSection('resources')}
                >
                  Resources
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobileSection === 'resources' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedMobileSection === 'resources' && (
                  <div className="mt-2 space-y-3">
                    {resourceSections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {section.title}
                        </h4>
                        {section.items.map((item, itemIndex) => (
                          <Link href={item.href} key={itemIndex}>
                            <a
                              className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions Section */}
              <div className="mb-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
                  onClick={() => toggleMobileSection('solutions')}
                >
                  Solutions
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedMobileSection === 'solutions' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedMobileSection === 'solutions' && (
                  <div className="mt-2 space-y-3">
                    {solutionSections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          {section.title}
                        </h4>
                        {section.items.map((item, itemIndex) => (
                          <Link href={item.href} key={itemIndex}>
                            <a
                              className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <Link href="/en/pricing">
                  <a
                    className="block py-2 text-gray-900 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                </Link>
                <Link href="/en/success-stories">
                  <a
                    className="block py-2 text-gray-900 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Success Stories
                  </a>
                </Link>
                <Link href="/en/request-demo">
                  <a
                    className="block py-2 px-4 bg-blue-600 text-white rounded-lg font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div
        className={classNames('relative', className)}
        onMouseLeave={handleMouseLeave}
        data-mega-menu
      >
        {/* Desktop Navigation */}
        <div className="flex items-center space-x-6">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('product')}
          >
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150"
              onClick={() => handleMenuClick('product')}
            >
              Product
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <MegaDropdown
              sections={productSections}
              isOpen={activeDropdown === 'product'}
              onClose={closeDropdown}
            />
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('resources')}
          >
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150"
              onClick={() => handleMenuClick('resources')}
            >
              Resources
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <MegaDropdown
              sections={resourceSections}
              isOpen={activeDropdown === 'resources'}
              onClose={closeDropdown}
            />
          </div>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('solutions')}
          >
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150"
              onClick={() => handleMenuClick('solutions')}
            >
              Solutions
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <MegaDropdown
              sections={solutionSections}
              isOpen={activeDropdown === 'solutions'}
              onClose={closeDropdown}
            />
          </div>

          {/* Simple Links */}
          <Link href="/en/pricing">
            <a className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150">
              Pricing
            </a>
          </Link>

          <Link href="/en/success-stories">
            <a className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150">
              Success Stories
            </a>
          </Link>

          {/* CTA Button */}
          <Link href="/en/request-demo">
            <a className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 ml-6">
              Get Started
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default MegaMenu
