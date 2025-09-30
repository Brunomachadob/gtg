import { isDevelopment } from '../utils/environment';
import { StorageService } from "./StorageService.ts";

export class DateService {
  /**
   * Get the current date - either real date or mock date in DEV mode
   * @returns Date object representing the current date
   */
  static getCurrentDate(): Date {
    if (isDevelopment()) {
        return StorageService.getMockDate() || new Date();
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
        StorageService.setMockDate(date)
    }
  }

  /**
   * Clear mock date and return to real current date
   */
  static clearMockDate(): void {
    if (isDevelopment()) {
      StorageService.clearMockDate();
    }
  }

  /**
   * Get the mock date if set, otherwise null
   * @returns Mock date or null
   */
  static getMockDate(): Date | null {
      return isDevelopment() ? StorageService.getMockDate() : null
  }
}
