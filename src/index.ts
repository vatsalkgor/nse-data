export interface QuoteName {
  name: string;
}

export interface Quote {
  name: string;
  lastTradedPrice: number;
}
export default class NSE {
  public getQuote(name: QuoteName): Quote {
    if (name) return { name: 'INFY', lastTradedPrice: 432.1 };
    else throw Error('Not a valid QuoteName');
  }
}
