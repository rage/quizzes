export const Course = `
  type Course {
    id: String!
    organization: Organization,
    organizationId: Int,
    languages: [Language],
    createdAt: DateTime,
    updatedAt: DateTime
  }
`

//     organization: Organization,
