export const {
  red,
  yellow,
  orange,
  pink,
  purple,
  blue,
  green,
  darkBlue,
  lilac,
  grey,
  paleBlue,
} = {
  red: '#f75c4b',
  yellow: '#fed800',
  orange: '#f9ae2d',
  pink: '#fdd4ff',
  purple: '#c291c5',
  blue: '#989dff',
  green: '#2db983',
  darkBlue: '#788efb',
  lilac: '#c4b5fe',
  grey: '#eff0f1',
  paleBlue: '#ced7fb',
}

// Theme colors for use across the application
export const themeColors = {
  blue: {
    base: 'text-blue-500',
    light: 'bg-blue-50',
    hex: '#3b82f6', // Tailwind blue-500
  },
  purple: {
    base: 'text-purple-500',
    light: 'bg-purple-50',
    hex: '#8b5cf6', // Tailwind purple-500
  },
  green: {
    base: 'text-green-500',
    light: 'bg-green-50',
    hex: '#22c55e', // Tailwind green-500
  },
  pink: {
    base: 'text-pink-500',
    light: 'bg-pink-50',
    hex: '#ec4899', // Tailwind pink-500
  },
  yellow: {
    base: 'text-yellow-500',
    light: 'bg-yellow-50',
    hex: '#eab308', // Tailwind yellow-500
  },
  orange: {
    base: 'text-orange-500',
    light: 'bg-orange-50',
    hex: '#f97316', // Tailwind orange-500
  },
  teal: {
    base: 'text-teal-500',
    light: 'bg-teal-50',
    hex: '#14b8a6', // Tailwind teal-500
  },
  red: {
    base: 'text-red-500',
    light: 'bg-red-50',
    hex: '#ef4444', // Tailwind red-500
  },
  gray: {
    base: 'text-gray-500',
    light: 'bg-gray-50',
    hex: '#6b7280', // Tailwind gray-500
  },
}

// Program statistics card colors
export const programStatColors = {
  totalUsers: {
    bg: themeColors.blue.light,
    text: themeColors.blue.base,
  },
  mentors: {
    bg: themeColors.purple.light,
    text: themeColors.purple.base,
  },
  mentees: {
    bg: themeColors.green.light,
    text: themeColors.green.base,
  },
  totalBookings: {
    bg: themeColors.pink.light,
    text: themeColors.pink.base,
  },
  totalReviews: {
    bg: themeColors.yellow.light,
    text: themeColors.yellow.base,
  },
}

export const colors = [
  yellow,
  red,
  pink,
  orange,
  purple,
  blue,
  green,
  darkBlue,
  lilac,
  grey,
  paleBlue,
]

export const disabledColors = [
  grey,
  yellow,
  red,
  pink,
  orange,
  purple,
  blue,
  green,
  darkBlue,
  lilac,
  paleBlue,
]

export type ToggleViewType = {
  id: string
  label: string
}
export const toggleViews: Array<ToggleViewType> = [
  { id: 'sessions', label: 'Sessions' },
  { id: 'duration', label: 'Hours' },
  { id: 'mentees', label: 'Active Mentees' },
  { id: 'signups', label: 'Signups' },
]
