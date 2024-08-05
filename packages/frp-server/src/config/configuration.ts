export default () => ({
  nocodb: {
    baseUri: process.env.NOCODB_URI,
    token: process.env.NOCODB_TOKEN,

    // Faculty Table
    facultyTableID: process.env.FACULTY_TABLE_ID,
    facultyToFrpID: process.env.FACULTY_TO_FRP_ID,

    // FRP Table
    frpTableID: process.env.FRP_TABLE_ID,

    // Publication Table
    publicationTableID: process.env.PUBLICATION_TABLE_ID,
    publicationToFacultyID: process.env.PUBLICATION_TO_FACULTY_ID,
    publicationToFRPID: process.env.PUBLICATION_TO_FRP_ID,

    // Publication Upload Table
    publicationUploadTableID: process.env.PUBLICATION_UPLOAD_TABLE_ID,
    publicationUploadToFacultyID: process.env.PUBLICATION_UPLOAD_TO_FACULTY_ID,

    // Grant Table
    grantsTableID: process.env.GRANT_TABLE_ID,
    grantsToFacultyID: process.env.GRANT_TO_FACULTY_ID,
    grantsToFRPID: process.env.GRANT_TO_FRP_ID,

    // Grant Upload Table
    grantUploadTableID: process.env.GRANT_UPLOAD_TABLE_ID,
    grantUploadToFacultyID: process.env.GRANT_UPLOAD_TO_FACULTY_ID
  },
  kube: {
    jobImage: process.env.JOB_IMAGE,
    namespace: process.env.KUBE_NAMESPACE
  },
  server: {
    url: process.env.BACKEND_URL
  },
  dimensions: {
    key: process.env.DIMENSIONS_API_KEY
  }
});
