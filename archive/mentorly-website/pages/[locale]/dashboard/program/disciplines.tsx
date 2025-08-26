import { gql } from '@apollo/client'
import Button from 'components/Button'
import AddModal from 'components/Dashboard/Disciplines/AddModal'
import EmptySubState from 'components/Dashboard/Disciplines/EmptySubState'
import {
  disciplineFields,
  subdisciplineFields,
} from 'components/Dashboard/Disciplines/fragments'
import Item from 'components/Dashboard/Disciplines/Item'
import UpdateModal, {
  DisciplinesType,
} from 'components/Dashboard/Disciplines/UpdateModal'
import DashboardLayout from 'components/Dashboard/Layout'
import { ProgramMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentGroup } from 'lib/GroupContext'
import isBrowser from 'lib/isBrowser'
import { connectServerSideProps } from 'lib/ssg'
import { upperFirst } from 'lodash'
import { useState, VFC } from 'react'
import { Plus } from 'react-feather'
import { useIntl } from 'react-intl'
import { GroupDisciplinesQuery, useGroupDisciplinesQuery } from 'types/graphql'

gql`
  query groupDisciplines($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      name
      disciplines {
        ...DisciplineFields
      }
      independentSubdisciplines {
        ...SubdisciplineFields
      }
      hasIndependentSubdisciplines
    }
  }
  ${disciplineFields}
  ${subdisciplineFields}
`

const DisciplinesPage = () => {
  const { currentGroup } = useCurrentGroup()

  const { data, loading, error } = useGroupDisciplinesQuery({
    variables: { groupId: currentGroup && currentGroup.id },
    skip: !currentGroup || !isBrowser(),
  })

  if (loading || !isBrowser()) {
    return <div>Loading</div>
  }

  if (error) {
    return <div>Error</div>
  }

  if (!data?.group) {
    return <div>Missing group</div>
  }

  return <Disciplines group={data.group} />
}

type DisciplinesProps = {
  group: NonNullable<GroupDisciplinesQuery['group']>
}

const Disciplines: VFC<DisciplinesProps> = ({ group }) => {
  const { formatMessage } = useIntl()
  const { showModal } = useModal()

  const {
    disciplines,
    hasIndependentSubdisciplines,
    independentSubdisciplines,
  } = group

  const [selectedDisciplineId, setSelectedDisciplineId] = useState<
    string | undefined
  >(disciplines[0]?.id)

  const selectedDiscipline = disciplines.find(
    (element) => element.id === selectedDisciplineId
  )

  const subsList = hasIndependentSubdisciplines
    ? independentSubdisciplines || []
    : selectedDiscipline?.subdisciplines || []

  const subdisciplineTitle =
    selectedDiscipline && !hasIndependentSubdisciplines
      ? formatMessage({ id: 'term.subdisciplines' }) +
        ' ' +
        formatMessage({ id: 'term.for' }) +
        ' ' +
        selectedDiscipline?.name
      : formatMessage({ id: 'term.subdisciplines' })

  const title = (typename: string) =>
    typename === 'Discipline'
      ? formatMessage({ id: 'term.discipline' })
      : subdisciplineTitle

  const openUpdateModal = (item: any) => {
    showModal({
      padding: 'p-0',
      content: (
        <UpdateModal
          item={item}
          title={upperFirst(title(item.__typename))}
          selectedDiscipline={selectedDiscipline}
          setSelectedDisciplineId={setSelectedDisciplineId}
          canDelete={
            item.subdisciplines ? item.subdisciplines.length === 0 : true
          }
        />
      ),
    })
  }

  const openAddModal = (type: DisciplinesType) => {
    showModal({
      padding: 'p-0',
      content: (
        <AddModal
          type={type}
          title={upperFirst(title(type))}
          selectedDiscipline={selectedDiscipline}
          setSelectedDisciplineId={setSelectedDisciplineId}
        />
      ),
    })
  }

  return (
    <>
      <ProgramMenu />
      <Panel>
        <Panel.Body>
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col">
              <h2 className="font-bold mb-4">
                {formatMessage({ id: 'form.disciplines' })}
              </h2>
              <div className="flex flex-col">
                {disciplines?.length > 0
                  ? disciplines.map((disc: any) => (
                      <Item
                        key={disc.id}
                        item={disc}
                        handleSelect={
                          hasIndependentSubdisciplines
                            ? undefined
                            : setSelectedDisciplineId
                        }
                        handleUpdate={openUpdateModal}
                        selected={selectedDiscipline}
                      />
                    ))
                  : formatMessage(
                      { id: 'phrase.noXforY' },
                      {
                        x: formatMessage({
                          id: 'form.disciplines',
                        }).toLowerCase(),
                        y: group.name,
                      }
                    )}
                <Button
                  className="flex items-center space-x-2 mt-4"
                  onClick={() => openAddModal('discipline')}
                >
                  <Plus size={18} />
                  <p>{formatMessage({ id: 'form.discipline' })}</p>
                </Button>
              </div>
            </div>
            <div className="flex flex-col ">
              <h2 className="font-bold mb-4">{subdisciplineTitle}</h2>
              <div className="flex flex-col bg-gray">
                {subsList?.length > 0 ? (
                  subsList?.map((sub: any) => (
                    <Item
                      key={sub.id}
                      item={sub}
                      selected={selectedDiscipline}
                      handleUpdate={openUpdateModal}
                    />
                  ))
                ) : (
                  <EmptySubState selectedDiscipline={selectedDiscipline} />
                )}
              </div>
              <Button
                className="flex items-center space-x-2 mt-4"
                onClick={() => openAddModal('subdiscipline')}
                disabled={!selectedDiscipline && !hasIndependentSubdisciplines}
              >
                <Plus size={18} />
                <p>{formatMessage({ id: 'form.subdiscipline' })}</p>
              </Button>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </>
  )
}

DisciplinesPage.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(DisciplinesPage)
export default DisciplinesPage
