import axios from 'axios';
import { readFileSync } from 'fs';
import NSE from '../src/index';
const nse = new NSE();

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStockCodes', () => {
  it('checks correct response', async () => {
    const resp = {
      data:
        'SYMBOL,NAME OF COMPANY,TYPE\nAXISBANK,AXIS Bank Ltd., EQ\nVOLTAS,Voltas Limite, EQ\nWABAG,VA Tech Wabag Limited,EQ',
    };
    mockedAxios.get.mockResolvedValue(resp);
    const codes = await nse.getStockCodes();
    expect(codes.length).toBe(3);
  });
  it('expects rejection', () => {
    mockedAxios.get.mockRejectedValueOnce('Invalid URL');
    const codes = nse.getStockCodes();
    expect(codes).rejects.toThrow('Invalid URL');
  });
});
describe('getStockQuote', () => {
  it('checks correct response', async () => {
    const file = readFileSync('tests/response.txt').toString();
    mockedAxios.get.mockResolvedValueOnce({ data: file });
    const quoteAxisBank = await nse.getQuote('AxisBank');
    expect(quoteAxisBank.data[0].symbol).toBe('AXISBANK');
  });
});
