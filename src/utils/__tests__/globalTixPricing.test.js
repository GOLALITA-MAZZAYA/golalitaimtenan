import {
  calculateSellingPrice,
  getTicketSellingPrice,
  validateSellingPrice,
  getDefaultMarkupPercentage,
} from '../globalTixPricing';

describe('calculateSellingPrice', () => {
  describe('basic markup', () => {
    it('applies 15% markup to nett price', () => {
      const result = calculateSellingPrice(100, 15);
      expect(result.sellingPrice).toBe(115);
      expect(result.nettPrice).toBe(100);
      expect(result.markupAmount).toBe(15);
      expect(result.markupPercentage).toBe(15);
    });

    it('applies custom markup percentage', () => {
      const result = calculateSellingPrice(200, 20);
      expect(result.sellingPrice).toBe(240);
      expect(result.markupAmount).toBe(40);
    });

    it('handles floating point nett price correctly', () => {
      // Real values from Product 35045 / TicketType 153793
      const result = calculateSellingPrice(281.34, 15);
      expect(result.sellingPrice).toBe(323.54);
      expect(result.nettPrice).toBe(281.34);
    });
  });

  describe('zero and invalid nett price', () => {
    it('returns zero selling price when nettPrice is 0', () => {
      const result = calculateSellingPrice(0, 15);
      expect(result.sellingPrice).toBe(0);
      expect(result.nettPrice).toBe(0);
      expect(result.isMSPRequired).toBe(false);
    });

    it('returns zero selling price when nettPrice is null', () => {
      const result = calculateSellingPrice(null, 15);
      expect(result.sellingPrice).toBe(0);
    });

    it('returns zero selling price when nettPrice is undefined', () => {
      const result = calculateSellingPrice(undefined, 15);
      expect(result.sellingPrice).toBe(0);
    });

    it('returns zero selling price when nettPrice is negative', () => {
      const result = calculateSellingPrice(-50, 15);
      expect(result.sellingPrice).toBe(0);
    });
  });

  describe('MSP enforcement', () => {
    it('uses markup price when it exceeds MSP', () => {
      // nettPrice=200, 15% markup=230, MSP=220 → use 230
      const result = calculateSellingPrice(200, 15, 220);
      expect(result.sellingPrice).toBe(230);
      expect(result.isMSPRequired).toBe(true);
    });

    it('enforces MSP when markup price is below it', () => {
      // Real case: nettPrice=281.34, 15% markup=323.54, MSP=332.49 → must use 332.49
      const result = calculateSellingPrice(281.34, 15, 332.49);
      expect(result.sellingPrice).toBe(332.49);
      expect(result.isMSPRequired).toBe(true);
      expect(result.mspPrice).toBe(332.49);
    });

    it('recalculates markup percentage when MSP is enforced', () => {
      // nettPrice=281.34, MSP=332.49 → effective markup = (332.49-281.34)/281.34 * 100 = 18.18%
      const result = calculateSellingPrice(281.34, 15, 332.49);
      expect(result.markupPercentage).toBeCloseTo(18.18, 1);
    });

    it('does not enforce MSP when MSP is null', () => {
      const result = calculateSellingPrice(100, 15, null);
      expect(result.sellingPrice).toBe(115);
      expect(result.isMSPRequired).toBe(false);
      expect(result.mspPrice).toBeNull();
    });

    it('does not enforce MSP when MSP is 0', () => {
      const result = calculateSellingPrice(100, 15, 0);
      expect(result.sellingPrice).toBe(115);
      expect(result.isMSPRequired).toBe(false);
    });

    it('uses MSP exactly when markup equals MSP', () => {
      const result = calculateSellingPrice(100, 15, 115);
      expect(result.sellingPrice).toBe(115);
    });
  });

  describe('original merchant price', () => {
    it('includes original price in result', () => {
      const result = calculateSellingPrice(100, 15, null, 200);
      expect(result.originalMerchantPrice).toBe(200);
    });

    it('sets original price to null when not provided', () => {
      const result = calculateSellingPrice(100, 15);
      expect(result.originalMerchantPrice).toBeNull();
    });
  });
});

describe('getTicketSellingPrice', () => {
  const staticTicket = {
    nettPrice: 100,
    minimumMerchantSellingPrice: null,
    originalMerchantPrice: 150,
  };

  describe('static pricing (no dynamic data)', () => {
    it('uses ticketType.nettPrice for markup calculation', () => {
      const result = getTicketSellingPrice(staticTicket, 15);
      expect(result.sellingPrice).toBe(115);
      expect(result.nettPrice).toBe(100);
    });

    it('falls back to ticketType.net_price if nettPrice is missing', () => {
      const ticket = { net_price: 200 };
      const result = getTicketSellingPrice(ticket, 15);
      expect(result.sellingPrice).toBe(230);
    });

    it('uses ticketType.minimumMerchantSellingPrice as MSP', () => {
      const ticket = { nettPrice: 281.34, minimumMerchantSellingPrice: 332.49 };
      const result = getTicketSellingPrice(ticket, 15);
      expect(result.sellingPrice).toBe(332.49);
    });

    it('falls back to ticketType.min_selling_price if minimumMerchantSellingPrice missing', () => {
      const ticket = { nettPrice: 281.34, min_selling_price: 332.49 };
      const result = getTicketSellingPrice(ticket, 15);
      expect(result.sellingPrice).toBe(332.49);
    });

    it('uses ticketType.originalMerchantPrice as reference price', () => {
      const result = getTicketSellingPrice(staticTicket, 15);
      expect(result.originalMerchantPrice).toBe(150);
    });

    it('returns zero for empty ticket object', () => {
      const result = getTicketSellingPrice({}, 15);
      expect(result.sellingPrice).toBe(0);
    });

    it('uses default 15% markup when not specified', () => {
      const result = getTicketSellingPrice(staticTicket);
      expect(result.sellingPrice).toBe(115);
    });
  });

  describe('dynamic pricing (CEA data overrides static)', () => {
    it('uses CEA nettPrice instead of static ticketType.nettPrice', () => {
      // ticketType has stale nettPrice=50, CEA says 281.34
      const staleTicket = { nettPrice: 50 };
      const ceaData = { nettPrice: 281.34 };
      const result = getTicketSellingPrice(staleTicket, 15, ceaData);
      expect(result.nettPrice).toBe(281.34);
    });

    it('uses CEA msp instead of static ticketType MSP', () => {
      const ticket = { nettPrice: 100, minimumMerchantSellingPrice: 999 };
      const ceaData = { nettPrice: 281.34, msp: 332.49 };
      const result = getTicketSellingPrice(ticket, 15, ceaData);
      expect(result.sellingPrice).toBe(332.49);
    });

    it('enforces CEA msp when markup is below it', () => {
      // Product 35045 real values from Postman response
      const ceaData = { nettPrice: 281.34, msp: 332.49 };
      const result = getTicketSellingPrice({}, 15, ceaData);
      expect(result.sellingPrice).toBe(332.49);
      expect(result.isMSPRequired).toBe(true);
    });

    it('uses CEA rsp as originalMerchantPrice reference', () => {
      const ceaData = { nettPrice: 281.34, rsp: 383.65 };
      const result = getTicketSellingPrice({}, 15, ceaData);
      expect(result.originalMerchantPrice).toBe(383.65);
    });

    it('handles CEA data with no msp gracefully', () => {
      const ceaData = { nettPrice: 100 };
      const result = getTicketSellingPrice({}, 15, ceaData);
      expect(result.sellingPrice).toBe(115);
      expect(result.isMSPRequired).toBe(false);
    });

    it('uses CEA nettPrice of 0 as-is (nullish coalescing does not fall back on 0)', () => {
      // ?? only falls back on null/undefined — so CEA returning 0 means 0, not stale ticket price
      const ticket = { nettPrice: 100 };
      const ceaData = { nettPrice: 0 };
      const result = getTicketSellingPrice(ticket, 15, ceaData);
      expect(result.sellingPrice).toBe(0);
    });
  });
});

describe('validateSellingPrice', () => {
  it('returns valid when price is above MSP', () => {
    const result = validateSellingPrice(350, 332.49);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('returns valid when price equals MSP exactly', () => {
    const result = validateSellingPrice(332.49, 332.49);
    expect(result.isValid).toBe(true);
  });

  it('returns invalid when price is below MSP', () => {
    const result = validateSellingPrice(300, 332.49);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('332.49');
    expect(result.minimumPrice).toBe(332.49);
  });

  it('returns valid when no MSP is set (null)', () => {
    const result = validateSellingPrice(50, null);
    expect(result.isValid).toBe(true);
    expect(result.minimumPrice).toBeNull();
  });

  it('returns valid when MSP is 0 (no restriction)', () => {
    const result = validateSellingPrice(50, 0);
    expect(result.isValid).toBe(true);
  });
});

describe('getDefaultMarkupPercentage', () => {
  it('returns 15', () => {
    expect(getDefaultMarkupPercentage()).toBe(15);
  });
});
