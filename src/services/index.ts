import logger from '../../logger';
import { Index } from './../models/index';
import { IIndex } from '../models/index';
import { isWeekend, subDays } from 'date-fns';

export class IndexService {

  async getIndex(name: string): Promise<number[][]>  {
   return await Index.aggregate([
    {
      "$match": {"name": name }
    },
    {
      "$unwind": "$history"
    },
    {
      "$sort": {
        "history.timestamp": -1
      }
    },
    {
      "$group": {
        "_id": "$_id",
        "history": {
          "$push": "$history"
        }
      }
    }
  ])
   .then((result) => {
     // aggregate returns a list rather than single results - there is no findOne
    const firstResult: IIndex = result[0];

    // create stock chart data object expected by client - highcharts pie data [[1,2], [3,4]]
    const indexSeries: number[][] = [];
    const history = firstResult?.history;

    let yesterday = subDays(new Date(), 1);

    history?.forEach((snapshot) => {
      const plotPoint: number[] = [];
      plotPoint.push(yesterday.getTime());
      plotPoint.push(snapshot.price);
      indexSeries.push(plotPoint);

      /** Override timestamp to simulate history from yesterday to -2y
       * (original data set has 2 years data points excluding weekdays)
       */
      do {
        yesterday = subDays(yesterday, 1);
      } while (isWeekend(yesterday));
    });


    /** Highcharts expect point series to be pre-sorted asc
     *  Here first column is timestamp
     */
    indexSeries.sort((a, b) => a[0] - b[0])
    return indexSeries;
   });
  }

}
