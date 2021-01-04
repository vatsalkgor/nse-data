import axios from 'axios';

export interface QuoteName {
  name: string;
}

interface StockCodes {
  stockCode: string;
  stockName: string;
}
export default class NSE {
  private codeCache: StockCodes[] = [];
  private stockCodeURL = 'http://www1.nseindia.com/content/equities/EQUITY_L.csv';

  public getStockCodes(): Promise<StockCodes[]> {
    return new Promise((resolve, reject) => {
      axios
        .get(this.stockCodeURL)
        .then((response) => {
          const csvStrings = response.data.split('\n');
          csvStrings.splice(0, 1);
          csvStrings.forEach((string: string) => {
            if (string.search(',') > 1) {
              const nameValuePair = string.split(',').slice(0, 2);
              this.codeCache.push({ stockCode: nameValuePair[0], stockName: nameValuePair[1] });
            }
          });
          resolve(this.codeCache);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
