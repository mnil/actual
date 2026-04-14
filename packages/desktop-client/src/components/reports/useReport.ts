import { useQuery } from '@tanstack/react-query';

import { useSpreadsheet } from '#hooks/useSpreadsheet';

export function useReport<T>(
  sheetName: string,
  getData: (
    spreadsheet: ReturnType<typeof useSpreadsheet>,
    setData: (results: T) => void,
  ) => Promise<void> | void,
  queryKey?: unknown[],
): T | null {
  const spreadsheet = useSpreadsheet();

  const { data } = useQuery({
    queryKey: queryKey ? ['report', sheetName, ...queryKey] : ['report', sheetName],
    queryFn: () => {
      return new Promise<T>((resolve, reject) => {
        try {
          const result = getData(spreadsheet, resolve);
          if (result instanceof Promise) {
            result.catch(reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    },
  });

  return data ?? null;
}
