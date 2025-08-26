import { gql } from '@apollo/client'
import Button from 'components/Button'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import Alert from 'components/feedback/Alert'
import FileInput from 'components/Uploader/FileInput'
import Uploader, { UploaderFileType } from 'components/Uploader/Uploader'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { reportsUrl } from 'lib/urls'
import Link from 'next/link'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useImportCsvFileMutation } from 'types/graphql'

gql`
  mutation importCsvFile($groupId: ID!, $file: UploadAttributes!) {
    importCsvFile(groupId: $groupId, file: $file) {
      groupFile {
        id
      }
      errors
      errorDetails
    }
  }
`

const Import = () => {
  const { currentGroup } = useCurrentGroup()
  const [importFile] = useImportCsvFileMutation()
  const [importLoading, setImportLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const { formatMessage } = useIntl()

  const templateUrl = reportsUrl(
    currentGroup.key,
    'members_template',
    'csv',
    'en'
  )

  const handleUpload = async (file: UploaderFileType) => {
    try {
      setImportLoading(true)
      await importFile({ variables: { file, groupId: currentGroup.id } })
      toast.success('CSV file uploaded!')
      setUploaded(true)
      setImportLoading(false)
    } catch (err: any) {
      setImportLoading(false)
      toast.error(err.message)
      console.error(err)
    }
  }

  return (
    <div>
      <Heading>
        <Heading.Text>
          {formatMessage({ id: 'header.importUsers' })}
        </Heading.Text>
      </Heading>
      <Panel>
        <Panel.Body>
          <div className="space-y-4">
            {uploaded && (
              <Alert type="success" showIcon>
                {formatMessage({ id: 'text.import.importingUsers' })}
              </Alert>
            )}
            <p>
              {formatMessage({ id: 'text.import.importUsers' })}
              <Link href={templateUrl}>
                <a className="underline">
                  {formatMessage({
                    id: 'term.template',
                  }).toLocaleLowerCase()}
                </a>
              </Link>
            </p>

            <p>{formatMessage({ id: 'text.import.onceFinished' })}</p>

            <div>
              <Uploader
                id="uploadCSV"
                onUpload={handleUpload}
                allowedFileTypes={['text/csv']}
              >
                <FileInput>
                  {({ onClick, loading }) => (
                    <Button
                      type="submit"
                      onClick={onClick}
                      loading={loading || importLoading}
                    >
                      {formatMessage({ id: 'button.import' })}
                    </Button>
                  )}
                </FileInput>
              </Uploader>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Import.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Import)
export default Import
