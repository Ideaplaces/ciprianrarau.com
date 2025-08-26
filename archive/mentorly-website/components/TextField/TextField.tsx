import React, { VFC } from 'react'

export const TextField: VFC = () => {
  return (
    <input
      className="bg-white focus:outline-none focus:ring border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
      type="email"
      placeholder="jane@example.com"
    />
  )
}
