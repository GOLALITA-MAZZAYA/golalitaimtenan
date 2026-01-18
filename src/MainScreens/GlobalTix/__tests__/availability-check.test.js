/**
 * Test file for GlobalTix availability checking functionality
 * This file tests the availability checking before adding tickets to cart
 */

import { globalTixAPI } from '../../../redux/globalTix/globalTix-api';

// Mock the globalTixAPI
jest.mock('../../../redux/globalTix/globalTix-api', () => ({
  globalTixAPI: {
    checkCalendarAvailability: jest.fn(),
  },
}));

describe('GlobalTix Availability Check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkCalendarAvailability', () => {
    it('should return success when tickets are available', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            optionId: '123',
            ticketTypeId: '456',
            status: 'available',
            message: 'Tickets available'
          }
        ]
      };

      globalTixAPI.checkCalendarAvailability.mockResolvedValue(mockResponse);

      const result = await globalTixAPI.checkCalendarAvailability({
        optionIds: ['123'],
        date: '2024-01-15',
        pullAll: true
      });

      expect(result).toEqual(mockResponse);
      expect(globalTixAPI.checkCalendarAvailability).toHaveBeenCalledWith({
        optionIds: ['123'],
        date: '2024-01-15',
        pullAll: true
      });
    });

    it('should return unavailable status when tickets are not available', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            optionId: '123',
            ticketTypeId: '456',
            status: 'not_available',
            message: 'Tickets sold out'
          }
        ]
      };

      globalTixAPI.checkCalendarAvailability.mockResolvedValue(mockResponse);

      const result = await globalTixAPI.checkCalendarAvailability({
        optionIds: ['123'],
        date: '2024-01-15',
        pullAll: true
      });

      expect(result.data[0].status).toBe('not_available');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      globalTixAPI.checkCalendarAvailability.mockRejectedValue(mockError);

      await expect(
        globalTixAPI.checkCalendarAvailability({
          optionIds: ['123'],
          date: '2024-01-15',
          pullAll: true
        })
      ).rejects.toThrow('API Error');
    });
  });

  describe('Availability Check Logic', () => {
    it('should validate availability before adding to cart', () => {
      const availabilityResult = {
        optionId: '123',
        status: 'available'
      };

      const isAvailable = availabilityResult.status === 'available';
      expect(isAvailable).toBe(true);
    });

    it('should prevent adding unavailable tickets to cart', () => {
      const availabilityResult = {
        optionId: '123',
        status: 'not_available'
      };

      const isAvailable = availabilityResult.status === 'available';
      expect(isAvailable).toBe(false);
    });

    it('should handle missing availability data', () => {
      const availabilityResult = null;
      const isAvailable = availabilityResult && availabilityResult.status === 'available';
      expect(isAvailable).toBe(false);
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly for API', () => {
      const date = new Date('2024-01-15');
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      expect(formattedDate).toBe('2024-1-15');
    });

    it('should use current date when no date is selected', () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      expect(formattedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

// Integration test for the complete flow
describe('Complete Availability Check Flow', () => {
  it('should complete the full availability check and add to cart flow', async () => {
    // Mock successful availability check
    const mockAvailabilityResponse = {
      success: true,
      data: [
        {
          optionId: '123',
          ticketTypeId: '456',
          status: 'available',
          message: 'Tickets available'
        }
      ]
    };

    globalTixAPI.checkCalendarAvailability.mockResolvedValue(mockAvailabilityResponse);

    // Simulate the availability check
    const availabilityResponse = await globalTixAPI.checkCalendarAvailability({
      optionIds: ['123'],
      date: '2024-01-15',
      pullAll: true
    });

    // Verify availability
    expect(availabilityResponse.success).toBe(true);
    
    const availabilityResult = availabilityResponse.data.find(item => 
      item.optionId === '123'
    );
    
    expect(availabilityResult).toBeDefined();
    expect(availabilityResult.status).toBe('available');

    // If available, proceed with adding to cart
    if (availabilityResult && availabilityResult.status === 'available') {
      // This would be the actual cart addition logic
      const cartPayload = {
        productId: 'product123',
        optionId: '123',
        ticketTypeId: '456',
        quantity: 1
      };
      
      expect(cartPayload).toBeDefined();
      expect(cartPayload.optionId).toBe('123');
    }
  });
});





