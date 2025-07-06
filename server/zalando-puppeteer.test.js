const { extractProductImage } = require('./zalando-puppeteer');
const puppeteer = require('puppeteer');

jest.mock('puppeteer');

describe('extractProductImage', () => {
  it('should extract the og:image URL when it exists', async () => {
    const mockUrl = 'https://www.zalando.de/some-product.html';
    const expectedImageUrl = 'https://img01.ztat.net/article/spp-media-p1/some-image.jpg';

    const mockPage = {
      setUserAgent: jest.fn(),
      setExtraHTTPHeaders: jest.fn(),
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(expectedImageUrl),
      close: jest.fn(),
    };

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    puppeteer.launch.mockResolvedValue(mockBrowser);

    const imageUrl = await extractProductImage(mockUrl);

    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: 'new' });
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.goto).toHaveBeenCalledWith(mockUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(imageUrl).toBe(expectedImageUrl);
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('should return null if no image is found', async () => {
    const mockUrl = 'https://www.zalando.de/no-image-product.html';

    const mockPage = {
      setUserAgent: jest.fn(),
      setExtraHTTPHeaders: jest.fn(),
      goto: jest.fn(),
      waitForSelector: jest.fn(),
      evaluate: jest.fn().mockResolvedValue(null),
      close: jest.fn(),
    };

    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    puppeteer.launch.mockResolvedValue(mockBrowser);

    const imageUrl = await extractProductImage(mockUrl);

    expect(imageUrl).toBeNull();
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});
