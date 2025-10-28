// Types for related entities
export interface TimeFormatInfo {
  id: string;
  value: string;
  name: string;
  description?: string;
}

export interface LanguageInfo {
  id: string;
  code: string;
  name: string;
  nativeName?: string;
  country?: string;
}

export interface CurrencyInfo {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
  type: string;
  decimalPlaces: number;
}

export class UserConfiguration {
  private constructor(
    private readonly _id: string,
    private _userId: string,
    private _dateFormat: string,
    private _timeFormatId: string | null,
    private _languageId: string | null,
    private _currencyId: string | null,
    private _decimalSeparator: string,
    private _itemsPerPage: number,
    private _theme: string,
    private _primaryColor: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private _timeFormat?: TimeFormatInfo | null,
    private _language?: LanguageInfo | null,
    private _currency?: CurrencyInfo | null,
  ) {}

  static create(
    data: {
      userId: string;
      dateFormat?: string;
      timeFormatId?: string | null;
      languageId?: string | null;
      currencyId?: string | null;
      decimalSeparator?: string;
      itemsPerPage?: number;
      theme?: string;
      primaryColor?: string;
      createdAt?: Date;
      updatedAt?: Date;
      timeFormat?: TimeFormatInfo | null;
      language?: LanguageInfo | null;
      currency?: CurrencyInfo | null;
    },
    id?: string,
  ): UserConfiguration {
    return new UserConfiguration(
      id || '',
      data.userId,
      data.dateFormat || 'DD/MM/YYYY',
      data.timeFormatId || null,
      data.languageId || null,
      data.currencyId || null,
      data.decimalSeparator || ',',
      data.itemsPerPage || 20,
      data.theme || 'light',
      data.primaryColor || '#1976d2',
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.timeFormat || null,
      data.language || null,
      data.currency || null,
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

  get timeFormatId(): string | null {
    return this._timeFormatId;
  }

  get languageId(): string | null {
    return this._languageId;
  }

  get currencyId(): string | null {
    return this._currencyId;
  }

  get decimalSeparator(): string {
    return this._decimalSeparator;
  }

  get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  get theme(): string {
    return this._theme;
  }

  get primaryColor(): string {
    return this._primaryColor;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get timeFormat(): TimeFormatInfo | null {
    return this._timeFormat || null;
  }

  get language(): LanguageInfo | null {
    return this._language || null;
  }

  get currency(): CurrencyInfo | null {
    return this._currency || null;
  }

  // Update methods
  updateGeneralPreferences(data: {
    dateFormat?: string;
    timeFormatId?: string;
    languageId?: string;
    currencyId?: string;
    decimalSeparator?: string;
    itemsPerPage?: number;
  }): void {
    if (data.dateFormat) this._dateFormat = data.dateFormat;
    if (data.timeFormatId !== undefined) this._timeFormatId = data.timeFormatId;
    if (data.languageId !== undefined) this._languageId = data.languageId;
    if (data.currencyId !== undefined) this._currencyId = data.currencyId;
    if (data.decimalSeparator) this._decimalSeparator = data.decimalSeparator;
    if (data.itemsPerPage !== undefined) this._itemsPerPage = data.itemsPerPage;
  }

  updateInterfaceCustomization(data: {
    theme?: string;
    primaryColor?: string;
  }): void {
    if (data.theme) this._theme = data.theme;
    if (data.primaryColor) this._primaryColor = data.primaryColor;
  }

  // Update related entity data
  updateRelatedEntities(data: {
    timeFormat?: TimeFormatInfo | null;
    language?: LanguageInfo | null;
    currency?: CurrencyInfo | null;
  }): void {
    if (data.timeFormat !== undefined) this._timeFormat = data.timeFormat;
    if (data.language !== undefined) this._language = data.language;
    if (data.currency !== undefined) this._currency = data.currency;
  }

  // Validation methods
  static isValidDateFormat(format: string): boolean {
    const validFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
    return validFormats.includes(format);
  }

  static isValidDecimalSeparator(separator: string): boolean {
    const validSeparators = [',', '.'];
    return validSeparators.includes(separator);
  }

  static isValidItemsPerPage(items: number): boolean {
    const validOptions = [10, 20, 50, 100];
    return validOptions.includes(items);
  }

  static isValidTheme(theme: string): boolean {
    const validThemes = ['light', 'dark', 'system'];
    return validThemes.includes(theme);
  }

  static isValidColor(color: string): boolean {
    // Basic hex color validation
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  // Helper methods to get readable values
  getTimeFormatValue(): string | null {
    return this._timeFormat?.value || null;
  }

  getLanguageCode(): string | null {
    return this._language?.code || null;
  }

  getCurrencyCode(): string | null {
    return this._currency?.code || null;
  }
}
