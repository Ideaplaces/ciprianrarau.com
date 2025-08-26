import { Meta, Story } from '@storybook/react'
import { userFactory } from 'factories/user'
import { useEffect, useState } from 'react'

import MemberSearchList from './MemberSearchList'

export default {
  title: 'controls/MemberSearchList',
  component: MemberSearchList,
  argTypes: {},
} as Meta

const Template: Story = (args) => {
  const users = [
    userFactory.build({ id: '1', name: 'Ryan Buckley' }),
    userFactory.build({ id: '2', name: 'Rodney Hackerfield' }),
    ...userFactory.buildList(10),
  ]
  const [members, setMembers] = useState(users)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setMembers(
      query?.length > 0 ? users.filter((u) => u.name.includes(query)) : users
    )
  }, [query])

  return (
    <MemberSearchList
      {...args}
      members={members}
      setQuery={setQuery}
      query={query}
    />
  )
}

export const SingleSelect = Template.bind({})
SingleSelect.args = {
  title: 'Search for members:',
  query: '',
  enableEmail: false,
  placeholder: 'Placeholder text',
  showDefaultUsers: false,
  inline: true,
  isMulti: false,
}
// SingleSelect.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const memberSearchList = canvas.getByTestId('memberSearchListInput')
//   await expect(memberSearchList).toBeInTheDocument()
//   await userEvent.click(memberSearchList)
//   await userEvent.type(memberSearchList, 'R')
//   const dropdownContainer = canvas.getByTestId('memberListDropdownContainer')
//   await expect(dropdownContainer).toBeInTheDocument()
//   await expect(dropdownContainer).toHaveTextContent('Ryan Buckley')
//   await expect(dropdownContainer).toHaveTextContent('Rodney Hackerfield')
//   const memberResult = canvas.getByTestId('memberResult2')
//   await userEvent.click(memberResult)
//   await expect(memberSearchList).not.toBeInTheDocument()
//   await expect(memberResult).toHaveTextContent('Rodney Hackerfield')
//   const iconPillRemoveBtn = canvas.getByTestId('iconPillRemoveBtn')
//   await userEvent.click(iconPillRemoveBtn)
//   await expect(dropdownContainer).not.toBeInTheDocument()
// }

export const MultiSelect = Template.bind({})
MultiSelect.args = {
  title: 'Search for members:',
  query: '',
  enableEmail: false,
  placeholder: 'Placeholder text',
  showDefaultUsers: false,
  inline: true,
  isMulti: true,
}
// MultiSelect.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const memberSearchList = canvas.getByTestId('memberSearchListInput')
//   await expect(memberSearchList).toBeInTheDocument()
//   await userEvent.click(memberSearchList)
//   // start searching for and select Rodney Hackerfield
//   await userEvent.type(memberSearchList, 'R')
//   let dropdownContainer = canvas.getByTestId('memberListDropdownContainer')
//   await expect(dropdownContainer).toBeInTheDocument()
//   await expect(dropdownContainer).toHaveTextContent('Ryan Buckley')
//   await expect(dropdownContainer).toHaveTextContent('Rodney Hackerfield')
//   const Rodney = canvas.getByTestId('memberResult2')
//   await userEvent.click(Rodney)
//   await expect(memberSearchList).toBeInTheDocument() // differs from non-multiselect
//   await expect(Rodney).toHaveTextContent('Rodney Hackerfield')
//   // search for and add another name, checking that the first is no longer an option
//   await userEvent.click(memberSearchList)
//   await userEvent.type(memberSearchList, 'R')
//   dropdownContainer = canvas.getByTestId('memberListDropdownContainer')
//   await expect(dropdownContainer).toBeInTheDocument()
//   await expect(dropdownContainer).toHaveTextContent('Ryan Buckley')
//   await expect(dropdownContainer).not.toHaveTextContent('Rodney Hackerfield')
//   const Ryan = canvas.getByTestId('memberResult1')
//   await userEvent.click(Ryan)
//   // remove each
//   const [removeRyan, removeRodney] = canvas.getAllByTestId('iconPillRemoveBtn')
//   await userEvent.click(removeRyan)
//   await expect(removeRyan).not.toBeInTheDocument()
//   await userEvent.click(removeRodney)
//   await expect(removeRodney).not.toBeInTheDocument()
// }

export const ListInside = Template.bind({})
ListInside.args = {
  title: 'Search for members:',
  query: '',
  enableEmail: false,
  placeholder: 'Placeholder text',
  showDefaultUsers: false,
  borderless: true,
  listInside: true,
  isMulti: true,
}
// ListInside.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   // input field appears and text can be entered
//   const memberSearchList = canvas.getByTestId('memberSearchListInput')
//   await expect(memberSearchList).toBeInTheDocument()
//   await userEvent.click(memberSearchList)
//   await userEvent.type(memberSearchList, 'R')
//   // list of results appear, relevant to search term
//   const dropdownContainer = canvas.getByTestId('memberListDropdownContainer')
//   await expect(dropdownContainer).toBeInTheDocument()
//   await expect(dropdownContainer).toHaveTextContent('Ryan Buckley')
//   await expect(dropdownContainer).toHaveTextContent('Rodney Hackerfield')
//   // user can click on a result to select that member
//   const memberResult = canvas.getByTestId('memberResult2')
//   await userEvent.click(memberResult)
//   await expect(memberSearchList).toBeInTheDocument() // differs from non-multiselect
//   await expect(memberResult).toHaveTextContent('Rodney Hackerfield')
//   // selected user is no longer in list
//   await userEvent.type(memberSearchList, 'Rodney')
//   const newDropdownContainer = canvas.getByTestId('memberListDropdownContainer')
//   await expect(newDropdownContainer).not.toHaveTextContent('Rodney Hackerfield')
//   // selected user appears in icon pill and can be removed
//   const iconPillRemoveBtn = canvas.getByTestId('iconPillRemoveBtn')
//   await userEvent.click(iconPillRemoveBtn)
//   await expect(dropdownContainer).not.toBeInTheDocument()
// }
