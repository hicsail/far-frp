import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs';
import { NocoDBPagination } from '../dto/pagination.dto';

/**
 * Helper function to make a request over all the
 * data in the pagination
 */
export const requestAll = async<ResponseType> (httpService: HttpService, requestURL: string): Promise<ResponseType[]> => {
  const results: ResponseType[] = [];


  let offset = 0;
  let allCaptured = false;

  // NOTE: Its expected the number of FRPs a faculty is associated is relatively small,
  // this will handle the pagination and grab all of them
  while (!allCaptured) {
    const result = await firstValueFrom(httpService.get<NocoDBPagination<ResponseType>>(requestURL, {
      params: {
        offset
      }
    }));

    if (result.status !== 200) {
      throw new Error(`Failed to make request against NocoDB`);
    }

    // Add all the links to the running list
    results.concat(result.data.list);

    // Update the loop variables in case another request is needed
    offset += result.data.pageInfo.pageSize;
    allCaptured = result.data.pageInfo.isLastPage;
  }

  return results;
};
