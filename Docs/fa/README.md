# DataSave - Professional Web Application

[![Status](https://img.shields.io/badge/Status-Phase%202%20Complete-brightgreen)](https://github.com)
[![Logging](https://img.shields.io/badge/Logging-Fully%20Integrated-blue)](assets/js/modules/logging.js)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)](package.json)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A comprehensive professional web application for processing Excel files with AI integration, designed with modern web standards and comprehensive logging capabilities.

## 🚀 Project Overview

This project is being developed in phases, with each module carefully designed and implemented according to professional standards. Currently, we have completed the foundation and logging infrastructure.

### ✅ Completed Phases

#### Phase 1: Project Foundation ✅
- **Project Structure**: Professional directory organization
- **Base HTML**: Responsive layout with Bootstrap RTL support
- **Core CSS**: Modern styling with CSS variables and animations
- **Main Application**: JavaScript architecture with ES6+ features
- **Documentation**: Comprehensive project guidelines and rules

#### Phase 2: Logging Module ✅
- **Complete Logging System**: Professional-grade logging with IndexedDB storage
- **Performance Optimized**: Batched writes, async operations, minimal overhead
- **Admin Interface**: Web-based configuration panel with real-time statistics
- **Full Integration**: Embedded throughout the application with global error handling
- **Testing Suite**: Comprehensive test interface for validation

## 📁 Project Structure

```
DataSave/
├── index.html                     # Main application page
├── test-logging.html              # Logging system test interface
├── README.md                      # Project documentation
├── assets/
│   ├── css/
│   │   ├── main.css               # Main stylesheet
│   │   └── components/            # Component-specific styles
│   ├── js/
│   │   ├── main.js                # Main application logic
│   │   └── modules/
│   │       ├── logging.js                 # ✅ Professional logging system
│   │       ├── logger-config.js           # ✅ Logging configuration & admin UI
│   │       ├── scrolling-jalali-picker.js # ✅ Modern Persian date picker
│   │       ├── numberUtils.js             # 🔄 Number utilities (placeholder)
│   │       └── excel-processor.js         # 🔄 Excel processing (placeholder)
│   └── images/                    # Project images
├── pages/
│   └── admin/                     # Admin panel pages (future)
└── Docs/
    └── Prompts/                   # Development documentation
        ├── 01-instructions-rols.md # ✅ Project rules & guidelines
        └── 02-Logging-module.md    # ✅ Logging implementation docs
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 RTL
- **Icons**: Font Awesome 6
- **Charts**: Chart.js
- **Storage**: IndexedDB with localStorage fallback
- **Testing**: Custom test suite with real-time monitoring

## 🎯 Key Features

### Implemented Features ✅

#### Professional Logging System
- **IndexedDB Storage**: Persistent, high-performance log storage
- **Automatic Log Rotation**: Maintains optimal database size
- **Multiple Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Real-time Statistics**: Live monitoring of application state
- **Performance Timing**: Built-in operation duration tracking
- **Function Tracing**: Entry/exit monitoring for debugging
- **Global Error Handling**: Automatic capture of uncaught exceptions
- **Configuration Management**: Web-based admin panel
- **Export Capabilities**: JSON export for external analysis

#### Application Infrastructure
- **Responsive Design**: Mobile-first approach with RTL support
- **Modern JavaScript**: ES6+ with modular architecture
- **Error Boundaries**: Comprehensive error handling
- **Performance Optimized**: Lazy loading and efficient operations
- **Accessibility**: ARIA labels and semantic markup

### Planned Features 🔄

- **ScrollingJalaliPicker Module**: Modern Persian date picker with advanced UI
- **Number Utilities**: Persian/English number conversion
- **Excel Processing Engine**: Advanced file parsing with AI integration
- **Admin Dashboard**: Comprehensive management interface
- **Advanced Analytics**: Detailed reporting and insights

## 🔧 Getting Started

### Prerequisites
- Modern web browser with IndexedDB support
- Local web server (for testing)

### Installation & Running

1. **Clone/Download** the project files
2. **Start a local server**:
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
3. **Open in browser**: `http://localhost:8080`

### Testing the Logging System

Visit `http://localhost:8080/test-logging.html` for comprehensive logging tests:
- ✅ All log level testing (DEBUG through FATAL)
- ✅ Performance benchmarking
- ✅ Bulk logging tests (100+ logs)
- ✅ Function tracing validation
- ✅ Real-time statistics monitoring
- ✅ Configuration panel testing
- ✅ Export/import functionality

## 📊 Logging System Usage

### Basic Logging
```javascript
// Different log levels
Logger.debug('Debug information', { userId: 123 });
Logger.info('User action completed', { action: 'file_upload' });
Logger.warn('Performance warning', { loadTime: 5000 });
Logger.error('Operation failed', error, { context: 'file_processing' });
Logger.fatal('Critical system error', error, { systemState: 'unstable' });
```

### Performance Monitoring
```javascript
// Time operations
const timer = Logger.time('File Processing');
// ... do work ...
const duration = timer(); // Automatically logs completion time

// Trace function calls
const exitTrace = Logger.trace('processExcelFile');
// ... function work ...
exitTrace(); // Logs function exit
```

### Admin Interface Access
- **Keyboard Shortcut**: `Ctrl+Shift+L` (open logger configuration)
- **Navigation Menu**: Click "لاگ‌ها" in the main navigation
- **Programmatic**: `window.loggerAdmin.showPanel()`

## 🔐 Security & Privacy

- ✅ **Client-side Storage**: No external data transmission
- ✅ **Data Sanitization**: Safe handling of user input
- ✅ **Error Boundaries**: Contained error handling
- ✅ **Performance Isolation**: No impact on main thread

## 📈 Performance Metrics

The logging system is designed for minimal performance impact:
- **Log Operation**: <1ms per log entry
- **Batch Processing**: 50-log batches for efficiency
- **Memory Management**: Automatic cleanup and rotation
- **Storage**: IndexedDB for optimal performance

## 🔄 Development Roadmap

### Phase 3: ScrollingJalaliPicker Module ✅
- **Modern Date Picker**: Professional Persian calendar with scrolling interface
- **Advanced UI**: Glass morphism design with smooth animations
- **Complete API**: Full method suite for date manipulation and validation
- **Mobile Optimized**: Responsive design for all devices
- **Performance Focused**: Optimized for speed and memory efficiency
- **Comprehensive Documentation**: Complete guide in Persian
- Complete Persian/Gregorian date conversion
- Holiday support and calculation
- Localized date formatting
- Integration with existing logging system

### Future Phases
1. **Number Utilities Module**: Persian/English number conversion
2. **Admin Dashboard**: Complete management interface
3. **Excel Processing Engine**: AI-powered file processing
4. **Advanced Analytics**: Comprehensive reporting system

## 🤝 Development Guidelines

This project follows strict professional standards:
- **Code Quality**: ESLint compliance, JSDoc documentation
- **Performance**: Optimized operations, lazy loading
- **Accessibility**: WCAG 2.1 compliance
- **Security**: Input validation, XSS protection
- **Testing**: Comprehensive test coverage
- **Documentation**: Detailed inline and external docs

## 📝 Documentation

- **Project Rules**: [`Docs/Prompts/01-instructions-rols.md`](Docs/Prompts/01-instructions-rols.md)
- **Logging Documentation**: [`Docs/Prompts/02-Logging-module.md`](Docs/Prompts/02-Logging-module.md)
- **ScrollingJalaliPicker Guide**: [`Docs/fa/SCROLLING_JALALI_PICKER_GUIDE.md`](Docs/fa/SCROLLING_JALALI_PICKER_GUIDE.md)
- **Module Documentation**: [`Docs/Prompts/07-scrolling-jalali-picker-module.md`](Docs/Prompts/07-scrolling-jalali-picker-module.md)
- **Usage Examples**: [`docs/scrolling-jalali-picker-usage.js`](docs/scrolling-jalali-picker-usage.js)
- **API Documentation**: Available in source code JSDoc comments

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **RTL Support**: Full Persian language support
- **Responsive Layout**: Mobile-first design
- **Dark Mode**: System preference detection
- **Smooth Animations**: CSS transitions and transforms
- **Accessibility**: Screen reader support

## 🧪 Testing

The project includes comprehensive testing capabilities:
- **Unit Testing**: Individual component validation
- **Integration Testing**: Cross-module functionality
- **Performance Testing**: Load and stress testing
- **User Interface Testing**: Interactive validation
- **Real-time Monitoring**: Live system state tracking

## 📞 Support & Contribution

This is a professional development project with structured phases. Each module is carefully designed, implemented, and tested before proceeding to the next phase.

---

**Project Status**: ✅ Phase 2 Complete - Logging System Fully Operational  
**Next Phase**: 🔄 NumberUtils Module Development  
**Version**: 1.0.0  
**Last Updated**: December 2024