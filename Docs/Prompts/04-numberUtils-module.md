You are an expert JavaScript developer specializing in utility modules for web applications, with a focus on handling numbers in bilingual (Persian/English) environments. I need you to design and implement a comprehensive number utilities module (e.g., numberUtils.js) that addresses common challenges with Persian (Farsi) and English numerals, especially in financial calculations, phone numbers, OTP codes, and database storage.

Key requirements:
- Financial formatting: For any monetary or financial amounts, always format numbers with thousand separators (e.g., 1000000 becomes 1,000,000). Support decimal places (e.g., 1234567.89 becomes 1,234,567.89). Make this customizable (e.g., separator char like ',' or '،' for Persian).
- Handling Persian/English numerals: 
  - Convert Persian numerals (۰-۹) to English (0-9) for inputs like phone numbers, mobile numbers, or OTP codes to ensure consistency.
  - When storing data in a database (simulate with localStorage or assume backend integration), always convert to English numerals.
  - Conversely, provide functions to convert English to Persian numerals for display in UI (e.g., for RTL layouts).
- Address other common challenges:
  - Prevent calculation errors: Ensure numbers are parsed correctly as floats/integers regardless of numeral type (e.g., parse '۱۲۳.۴۵' as 123.45).
  - Handle decimal separators: Support both '.' (English) and '٫' (Persian) for decimals, and convert/standardize them.
  - RTL support: Functions to format numbers for right-to-left display without breaking layout.
  - Validation: Check if a string is a valid number (in either numeral system), phone number (e.g., Iranian format), or OTP (e.g., 4-6 digits).
  - Rounding and precision: Utilities for financial rounding (e.g., to 2 decimals) to avoid floating-point issues.
  - Currency formatting: Optional addition of currency symbols (e.g., 'تومان' or 'IRR') with proper placement in RTL.
  - Error handling: Gracefully handle invalid inputs, logging warnings if needed.
- Make the module modular: Export functions like formatCurrency(amount), convertToEnglishNum(str), convertToPersianNum(num), parseNumber(str), validatePhone(str), etc.
- Documentation: Include detailed Persian comments (in Farsi) throughout the code explaining each function, its parameters, return values, and usage examples. Use JSDoc-style comments where appropriate, but ensure all comments are in Persian for Persian-speaking developers.

Provide the complete code as a single JavaScript file. Make it vanilla JS (no dependencies) and include example usages at the end in comments.

ترجمه فارسی :

این پرامپت برای ساخت یک ماژول ابزار مدیریت اعداد در برنامه‌های وب طراحی شده که چالش‌های مربوط به اعداد در محیط‌های دو‌زبانه (فارسی و انگلیسی) رو برطرف می‌کنه. امکانات این ماژول به شرح زیره:

1. **فرمت‌بندی مالی**:
   - برای مبالغ مالی، اعداد همیشه با جداکننده هزارگان نمایش داده می‌شن (مثل 1,000,000 برای یک میلیون).
   - پشتیبانی از اعشار (مثل 1,234,567.89).
   - جداکننده‌ها قابل تنظیمه (مثل استفاده از «،» برای فارسی یا «,» برای انگلیسی).

2. **مدیریت اعداد فارسی و انگلیسی**:
   - تبدیل اعداد فارسی (۰-۹) به انگلیسی (0-9) برای ورودی‌هایی مثل شماره تلفن، شماره موبایل یا کد OTP، تا سازگاری حفظ بشه.
   - ذخیره اعداد در دیتابیس (یا شبیه‌سازی با localStorage) همیشه به‌صورت انگلیسی.
   - تبدیل اعداد انگلیسی به فارسی برای نمایش در رابط کاربری (مثل UI با جهت راست به چپ).

3. **رفع چالش‌های رایج**:
   - **پارس کردن اعداد**: تبدیل درست رشته‌های عددی (مثل «۱۲۳٫۴۵» یا "123.45") به عدد (مثل 123.45) برای محاسبات بدون خطا.
   - **مدیریت اعشار**: پشتیبانی از جداکننده اعشار فارسی («٫») و انگلیسی («.») و استانداردسازی اون‌ها.
   - **پشتیبانی RTL**: فرمت‌بندی اعداد برای نمایش درست در رابط‌های راست به چپ.
   - **اعتبارسنجی**: بررسی معتبر بودن رشته‌های عددی، شماره تلفن (مثل فرمت ایرانی) یا کد OTP (مثل کد ۴-۶ رقمی).
   - **گرد کردن اعداد**: ابزارهایی برای گرد کردن اعداد مالی (مثل گرد کردن به ۲ رقم اعشار) برای جلوگیری از خطاهای اعشاری.
   - **فرمت ارز**: امکان اضافه کردن نماد ارز (مثل «تومان» یا «IRR») با قرارگیری درست در متن RTL.
   - **مدیریت خطاها**: برخورد مناسب با ورودی‌های نامعتبر و ثبت هشدار در صورت نیاز.

4. **ساختار مدولار**:
   - شامل توابعی مثل `formatCurrency(amount)` برای فرمت مالی، `convertToEnglishNum(str)` برای تبدیل به انگلیسی، `convertToPersianNum(num)` برای تبدیل به فارسی، `parseNumber(str)` برای پارس عدد و `validatePhone(str)` برای اعتبارسنجی.
   - نوشته شده با JavaScript خالص (بدون نیاز به کتابخونه خارجی).

5. **مستندات کامل**:
   - تمام توابع با کامنت‌های فارسی توضیح داده می‌شن، شامل توضیح عملکرد، پارامترها، خروجی‌ها و مثال استفاده.
   - کامنت‌ها به سبک JSDoc برای خوانایی بهتر.

6. **نمونه استفاده**:
   - شامل مثال‌هایی در کد برای نشان دادن نحوه استفاده از توابع (مثل فرمت کردن مبلغ یا تبدیل شماره تلفن).

این ماژول به‌گونه‌ای طراحی شده که مشکلات رایج کار با اعداد در برنامه‌های دو‌زبانه رو حل کنه، به‌خصوص برای اپ‌های مالی یا اپ‌هایی که با شماره تلفن و OTP سروکار دارن، و در عین حال ساده و قابل ادغام در پروژه‌های مختلف باشه.