import { isDevelopment } from '../utils/environment';

const MOCK_DATE_KEY = 'gtg_dev_mock_date';

export class DateService {
  /**
   * Get the current date - either real date or mock date in DEV mode
   * @returns Date object representing the current date
   */
  static getCurrentDate(): Date {
    if (isDevelopment()) {
      const mockDateString = localStorage.getItem(MOCK_DATE_KEY);
      if (mockDateString) {
        return new Date(mockDateString);
      }
    }
    return new Date();
  }

  /**
   * Get the current date as ISO string (YYYY-MM-DD format)
   * @returns ISO date string
   */
  static getCurrentDateString(): string {
    return this.getCurrentDate().toISOString().slice(0, 10);
  }

  /**
   * Set mock date for development mode
   * @param date Date to use as mock date
   */
  static setMockDate(date: Date): void {
    if (isDevelopment()) {
      localStorage.setItem(MOCK_DATE_KEY, date.toISOString());
    }
  }

  /**
   * Clear mock date and return to real current date
   */
  static clearMockDate(): void {
    if (isDevelopment()) {
      localStorage.removeItem(MOCK_DATE_KEY);
    }
  }

  /**
   * Get the mock date if set, otherwise null
   * @returns Mock date or null
   */
  static getMockDate(): Date | null {
    if (isDevelopment()) {
      const mockDateString = localStorage.getItem(MOCK_DATE_KEY);
      if (mockDateString) {
        return new Date(mockDateString);
      }
    }
    return null;
  }
}
