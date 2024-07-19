export default () => ({
  nocodb: {
    baseUri: process.env.NOCODB_URI,
    facultyTableID: process.env.FACULTY_TABLE_ID,
    facultyToFrpID: process.env.FACULTY_TO_FRP_ID,
    token: process.env.NOCODB_TOKEN,
    frpTableID: process.env.FRP_TABLE_ID,
    publicationTableID: process.env.PUBLICATION_TABLE_ID,
    publicationToFacultyID: process.env.PUBLICATION_TO_FACULTY_ID,
    publicationToFRPID: process.env.PUBLICATION_TO_FRP_ID
  }
});
