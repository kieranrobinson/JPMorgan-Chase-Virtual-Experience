import { ServerRespond } from './DataStreamer';


export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  //Process raw data
  static generateRow(serverRespond: ServerRespond[]): Row {
    //Use priceABC and priceDEF to get the ratio value between the two stocks
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    //Set the upper and lower bounds for trigger alert to be +10% and -10%
    const upperBound = 1 + 0.10;
    const lowerBound = 1 - 0.10;
    return {
      //Return data to Graph.tsx
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
         serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,  
    };
  }
}
