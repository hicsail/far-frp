import { PaginatedType } from 'nocodb-sdk';

type PaginationOperation = (offset: number) => Promise<{ list: any[]; pageInfo: PaginatedType }>;

/**
 * Helper function to make a request over all the
 * data in the pagination
 */
export const requestAll = async <ResponseType>(operation: PaginationOperation): Promise<ResponseType[]> => {
  let results: ResponseType[] = [];

  let offset = 0;
  let allCaptured = false;

  // NOTE: Its expected the number of FRPs a faculty is associated is relatively small,
  // this will handle the pagination and grab all of them
  while (!allCaptured) {
    const result = await operation(offset);

    // Add all the links to the running list
    results = results.concat(result.list);

    // Update the loop variables in case another request is needed
    offset += result.pageInfo.pageSize || 0;
    allCaptured = result.pageInfo.isLastPage || true;
  }

  return results;
};
