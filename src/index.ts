import axios from 'axios';

export interface QuoteName {
  name: string;
}

export interface StockCodes {
  stockCode: string;
  stockName: string;
}
export interface StockQuote {
  tradedDate: string;
  data: StockQuoteData[];
  optLink: string;
  otherSeries: Array<string>;
  futLink: string;
  lastUpdateTime: string;
}

export interface StockQuoteData {
  pricebandupper: number;
  symbol: string;
  applicableMargin: number;
  bcEndDate: string;
  totalSellQuantity: number;
  adhocMargin: number;
  companyName: string;
  marketType: string;
  exDate: string;
  bcStartDate: string;
  css_status_desc: string;
  dayHigh: number;
  securityVar: number;
  pricebandlower: number;
  sellQuantity5: number;
  sellQuantity4: number;
  sellQuantity3: number;
  cm_adj_high_dt: string;
  sellQuantity2: number;
  dayLow: number;
  sellQuantity1: number;
  quantityTraded: number;
  pChange: number;
  totalTradedValue: number;
  deliveryToTradedQuantity: number;
  totalBuyQuantity: number;
  averagePrice: number;
  indexVar: number | string;
  cm_ffm: number;
  purpose: string;
  buyPrice2: number;
  secDate: string;
  buyPrice1: number;
  high52: number;
  previousClose: number;
  ndEndDate: string;
  low52: number;
  buyPrice4: number;
  buyPrice3: number;
  recordDate: string;
  deliveryQuantity: number;
  buyPrice5: number;
  priceBand: string | number;
  extremeLossMargin: number;
  cm_adj_low_dt: string;
  varMargin: number;
  sellPrice1: number;
  sellPrice2: number;
  totalTradedVolume: number;
  sellPrice3: number;
  sellPrice4: number;
  sellPrice5: number;
  change: number;
  surv_indicator: string | number;
  ndStartDate: string;
  buyQuantity4: number;
  isExDateFlag: boolean;
  buyQuantity3: number;
  buyQuantity2: number;
  buyQuantity1: number;
  series: string;
  faceValue: number;
  buyQuantity5: number;
  closePrice: number;
  open: number;
  isinCode: string;
  lastPrice: number;
}

export default class NSE {
  private codeCache: StockCodes[] = [];
  private stockCodeURL = 'http://www1.nseindia.com/content/equities/EQUITY_L.csv';
  private stockQuoteURL = 'https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?';

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

  public getQuote(stockCode: string): Promise<StockQuote> {
    return new Promise((resolve, reject) => {
      stockCode = stockCode.toUpperCase();
      axios
        .get(`${this.stockQuoteURL}symbol=${stockCode}`)
        .then((response) => {
          const responseData = response.data;
          const regex = new RegExp(/<div id="responseDiv" style="display:none">(?<json>.*?)<\/div>/, 'gs');
          const match = regex.exec(responseData);
          const quote = JSON.parse(match.groups.json.trim());
          resolve(quote);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
