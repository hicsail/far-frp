export default () => ({
  nocodb: {
    baseUri: process.env.NOCODB_URI,
    facultyTableID: process.env.FACULTY_TABLE_ID,
    facultyToFrpID: process.env.FACULTY_TO_FRP_ID
  }
});
