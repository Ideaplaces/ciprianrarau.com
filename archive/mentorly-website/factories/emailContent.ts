import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { EmailTemplateFormFieldsFragment } from 'types/graphql'

export const emailContentFactory =
  Factory.define<EmailTemplateFormFieldsFragment>(({ sequence }) => ({
    emailContent: {
      id: sequence.toString(),
      key: sequence.toString(),
      subject: faker.lorem.word(2),
      body: faker.lorem.lines(10),
    },
    emailHeaderImage: {
      imageUrl: faker.image.abstract(600, 200),
    },
    emailFooterImage: {
      imageUrl: faker.image.abstract(600, 200),
    },
  }))
