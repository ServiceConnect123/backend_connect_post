export class UserConfiguration {
  private constructor(
    private readonly _id: string,
    private _userId: string,
    private _dateFormat: string,
    private _timeFormat: string,
    private _language: string,
    private _currency: string,
    private _decimalSeparator: string,
    private _itemsPerPage: number,
    private _theme: string,
    private _primaryColor: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  static create(
    data: {
      userId: string;
      dateFormat?: string;
      timeFormat?: string;
      language?: string;
      currency?: string;
      decimalSeparator?: string;
      itemsPerPage?: number;
      theme?: string;
      primaryColor?: string;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): UserConfiguration {
    return new UserConfiguration(
      id || '',
      data.userId,
      data.dateFormat || 'DD/MM/YYYY',
      data.timeFormat || '24h',
      data.language || 'es',
      data.currency || 'COP',
      data.decimalSeparator || ',',
      data.itemsPerPage || 20,
      data.theme || 'light',
      data.primaryColor || '#1976d2',
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
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

  get timeFormat(): string {
    return this._timeFormat;
  }

  get language(): string {
    return this._language;
  }

  get currency(): string {
    return this._currency;
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

  // Update methods
  updateGeneralPreferences(data: {
    dateFormat?: string;
    timeFormat?: string;
    language?: string;
    currency?: string;
    decimalSeparator?: string;
    itemsPerPage?: number;
  }): void {
    if (data.dateFormat) this._dateFormat = data.dateFormat;
    if (data.timeFormat) this._timeFormat = data.timeFormat;
    if (data.language) this._language = data.language;
    if (data.currency) this._currency = data.currency;
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

  // Validation methods
  static isValidDateFormat(format: string): boolean {
    const validFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
    return validFormats.includes(format);
  }

  static isValidTimeFormat(format: string): boolean {
    const validFormats = ['12h', '24h'];
    return validFormats.includes(format);
  }

  static isValidLanguage(language: string): boolean {
    const validLanguages = ['es', 'en'];
    return validLanguages.includes(language);
  }

  static isValidCurrency(currency: string): boolean {
    const validCurrencies = ['COP', 'USD', 'GTQ', 'EUR'];
    return validCurrencies.includes(currency);
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
}
