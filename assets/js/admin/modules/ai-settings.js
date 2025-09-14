/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 * 
 * @description: ماژول مدیریت تنظیمات سیستم هوش مصنوعی
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول تنظیمات هوش مصنوعی
 * AI Settings Module
 */
export default {
    // API paths
    apiPaths: [
        'http://localhost/datasave/backend/api/v1/ai-settings.php', // Primary: Direct XAMPP
        'http://127.0.0.1/datasave/backend/api/v1/ai-settings.php',
        'proxy-ai-settings.php', // Fallback: For Live Server
        '/datasave/backend/api/v1/ai-settings.php',
        '../backend/api/v1/ai-settings.php',
        'backend/api/v1/ai-settings.php'
    ],
    
    /**
     * بارگذاری محتوای تنظیمات هوش مصنوعی
     */
    async loadContent() {
        try {
            return `
                <div class="page-header">
                    <h1 class="page-title">
                        <div class="page-title-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        تنظیمات سیستم هوش مصنوعی
                    </h1>
                    <p class="page-subtitle">مدیریت کامل تنظیمات مدل‌ها، صوت و تصویر هوش مصنوعی</p>
                </div>
                
                <div class="content-sections">
                    <div class="content-section">
                        <div class="tabs-container" style="background: var(--glass-bg); backdrop-filter: var(--glass-blur); border-radius: var(--radius-xl); border: 1px solid var(--glass-border); overflow: hidden;">
                            <nav class="tabs-nav" style="display: flex; background: var(--glass-bg-lighter); border-bottom: 1px solid var(--glass-border);">
                                <button class="tab-button active" data-tab="model" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                    <i class="fas fa-brain"></i> تنظیمات مدل
                                </button>
                                <button class="tab-button" data-tab="audio" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                    <i class="fas fa-volume-up"></i> تنظیمات صوتی
                                </button>
                                <button class="tab-button" data-tab="image" style="flex: 1; padding: var(--spacing-4); border: none; background: transparent; color: var(--text-primary); cursor: pointer; transition: all var(--transition-normal); border-bottom: 2px solid transparent;">
                                    <i class="fas fa-image"></i> تنظیمات تصویری
                                </button>
                            </nav>
                            
                            <div class="tabs-content" style="padding: var(--spacing-6);">
                                <!-- Model Settings Tab -->
                                <div class="tab-pane active" id="model-tab">
                                    <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تنظیمات مدل‌های هوش مصنوعی</h3>
                                    <form id="modelSettingsForm" style="max-width: 600px;">
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">کلید API OpenAI:</label>
                                            <input type="password" id="openai_api_key" name="openai_api_key" class="form-input" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);" placeholder="sk-...">
                                        </div>
                                        
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">انتخاب مدل:</label>
                                            <select id="ai_model" name="ai_model" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                                <option value="gpt-4o">GPT-4o (جدیدترین)</option>
                                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                                <option value="gpt-4">GPT-4</option>
                                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">دما (Temperature):</label>
                                            <input type="range" id="temperature" name="temperature" min="0" max="2" step="0.1" value="0.7" style="width: 100%;">
                                            <div style="display: flex; justify-content: space-between; margin-top: var(--spacing-2);">
                                                <span>دقیق‌تر (0.0)</span>
                                                <span id="temperatureValue">0.7</span>
                                                <span>خلاقانه‌تر (2.0)</span>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">حداکثر تعداد توکن‌ها:</label>
                                            <input type="number" id="max_tokens" name="max_tokens" class="form-input" value="1000" min="1" max="4000" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                            <i class="fas fa-save"></i> ذخیره تنظیمات
                                        </button>
                                    </form>
                                    
                                    <!-- Chat Simulator -->
                                    <div style="margin-top: var(--spacing-8); max-width: 600px;">
                                        <h4 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">شبیه‌ساز چت با هوش مصنوعی</h4>
                                        <div id="chatMessages" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); height: 300px; overflow-y: auto; margin-bottom: var(--spacing-3);">
                                            <div style="color: var(--text-secondary); text-align: center; padding: var(--spacing-4);">
                                                پیام‌های چت در اینجا نمایش داده می‌شوند...
                                            </div>
                                        </div>
                                        <div style="display: flex; gap: var(--spacing-3);">
                                            <input type="text" id="chatInput" placeholder="پیام خود را وارد کنید..." style="flex: 1; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                            <button id="sendChatBtn" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                <i class="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Audio Settings Tab -->
                                <div class="tab-pane" id="audio-tab" style="display: none;">
                                    <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تنظیمات صوتی</h3>
                                    <form id="audioSettingsForm" style="max-width: 600px;">
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">سرویس تبدیل متن به صوت (TTS):</label>
                                            <select id="tts_service" name="tts_service" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                                <option value="openai">OpenAI TTS</option>
                                                <option value="google">Google TTS</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">انتخاب صدا:</label>
                                            <select id="voice_selection" name="voice_selection" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                                <option value="male">مرد</option>
                                                <option value="female">زن</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">سرعت تبدیل صوت:</label>
                                            <input type="range" id="speech_speed" name="speech_speed" min="0.5" max="2" step="0.1" value="1" style="width: 100%;">
                                            <div style="display: flex; justify-content: space-between; margin-top: var(--spacing-2);">
                                                <span>آهسته‌تر</span>
                                                <span id="speedValue">1.0x</span>
                                                <span>سریع‌تر</span>
                                            </div>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                            <i class="fas fa-save"></i> ذخیره تنظیمات
                                        </button>
                                    </form>
                                    
                                    <!-- Audio Test Section -->
                                    <div style="margin-top: var(--spacing-8); max-width: 600px;">
                                        <h4 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تست تنظیمات صوتی</h4>
                                        <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4);">
                                            <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                                <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">متن برای تبدیل به صوت:</label>
                                                <textarea id="testText" rows="3" placeholder="متن خود را برای تبدیل به صوت وارد کنید..." style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary); resize: vertical;"></textarea>
                                            </div>
                                            <div style="display: flex; gap: var(--spacing-3); flex-wrap: wrap;">
                                                <button id="testTTSBtn" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                    <i class="fas fa-volume-up"></i> تست TTS
                                                </button>
                                                <button id="testSTTBtn" class="btn btn-secondary" style="background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--glass-border); padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                    <i class="fas fa-microphone"></i> تست STT
                                                </button>
                                            </div>
                                            <audio id="audioPlayer" controls style="width: 100%; margin-top: var(--spacing-3);"></audio>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Image Settings Tab -->
                                <div class="tab-pane" id="image-tab" style="display: none;">
                                    <h3 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تنظیمات تصویری</h3>
                                    <form id="imageSettingsForm" style="max-width: 600px;">
                                        <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                            <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">سرویس تولید تصویر:</label>
                                            <select id="image_generation_service" name="image_generation_service" class="form-select" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                                <option value="openai">OpenAI DALL-E</option>
                                                <option value="stability">Stability AI</option>
                                            </select>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-medium);">
                                            <i class="fas fa-save"></i> ذخیره تنظیمات
                                        </button>
                                    </form>
                                    
                                    <!-- Image Test Section -->
                                    <div style="margin-top: var(--spacing-8);">
                                        <h4 style="margin-bottom: var(--spacing-4); color: var(--text-primary);">تست تنظیمات تصویری</h4>
                                        
                                        <!-- Image Generation Test -->
                                        <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4); max-width: 600px;">
                                            <h5 style="margin-bottom: var(--spacing-3); color: var(--text-primary);">تولید تصویر</h5>
                                            <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                                <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">توضیح تصویر مورد نظر:</label>
                                                <textarea id="imagePrompt" rows="3" placeholder="توضیح تصویر مورد نظر خود را وارد کنید..." style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary); resize: vertical;"></textarea>
                                            </div>
                                            <button id="generateImageBtn" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                <i class="fas fa-magic"></i> تولید تصویر
                                            </button>
                                            <div id="generatedImageContainer" style="margin-top: var(--spacing-4); min-height: 200px; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); border-radius: var(--radius-md); border: 1px dashed var(--glass-border);">
                                                <span style="color: var(--text-secondary);">تصویر تولید شده در اینجا نمایش داده می‌شود</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Image Analysis Test -->
                                        <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4); max-width: 600px;">
                                            <h5 style="margin-bottom: var(--spacing-3); color: var(--text-primary);">تحلیل تصویر</h5>
                                            <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                                <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">انتخاب تصویر برای تحلیل:</label>
                                                <input type="file" id="imageToAnalyze" accept="image/*" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                            </div>
                                            <button id="analyzeImageBtn" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                <i class="fas fa-search"></i> تحلیل تصویر
                                            </button>
                                            <div id="imageAnalysisResult" style="margin-top: var(--spacing-4); padding: var(--spacing-3); background: var(--glass-bg); border-radius: var(--radius-md); min-height: 100px;">
                                                <span style="color: var(--text-secondary);">نتیجه تحلیل تصویر در اینجا نمایش داده می‌شود</span>
                                            </div>
                                        </div>
                                        
                                        <!-- OCR Test -->
                                        <div class="test-card" style="background: var(--glass-bg-lighter); border-radius: var(--radius-lg); padding: var(--spacing-4); max-width: 600px;">
                                            <h5 style="margin-bottom: var(--spacing-3); color: var(--text-primary);">استخراج متن از تصویر (OCR)</h5>
                                            <div class="form-group" style="margin-bottom: var(--spacing-4);">
                                                <label class="form-label" style="display: block; margin-bottom: var(--spacing-2); color: var(--text-primary); font-weight: var(--font-weight-medium);">انتخاب تصویر برای OCR:</label>
                                                <input type="file" id="imageForOCR" accept="image/*" style="width: 100%; padding: var(--spacing-3); border: 1px solid var(--glass-border); border-radius: var(--radius-md); background: var(--glass-bg-lighter); color: var(--text-primary);">
                                            </div>
                                            <button id="ocrBtn" class="btn btn-primary" style="background: var(--primary-gradient); color: white; border: none; padding: var(--spacing-3) var(--spacing-4); border-radius: var(--radius-md); cursor: pointer;">
                                                <i class="fas fa-font"></i> استخراج متن
                                            </button>
                                            <div id="ocrResult" style="margin-top: var(--spacing-4); padding: var(--spacing-3); background: var(--glass-bg); border-radius: var(--radius-md); min-height: 100px;">
                                                <span style="color: var(--text-secondary);">متن استخراج شده از تصویر در اینجا نمایش داده می‌شود</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load AI settings content:', error);
            return `
                <div class="error-container">
                    <h2>❌ خطا در بارگذاری تنظیمات هوش مصنوعی</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">تلاش مجدد</button>
                </div>
            `;
        }
    },
    
    /**
     * بارگذاری تنظیمات AI از دیتابیس
     */
    async loadAISettingsData() {
        try {
            console.log('📤 Loading AI settings from database...');
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const apiPath of this.apiPaths) {
                try {
                    console.log('🔍 Trying API path:', apiPath);
                    
                    response = await fetch(apiPath, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('📋 Response status:', response.status, 'for path:', apiPath);
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log('📝 Content-Type:', contentType);
                        
                        if (contentType && contentType.includes('application/json')) {
                            break; // Found working API endpoint
                        } else {
                            console.warn('⚠️ Wrong content type:', contentType);
                            lastError = new Error(`نوع محتوا نادرست: ${contentType}`);
                            response = null;
                        }
                    } else {
                        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                        response = null;
                    }
                } catch (error) {
                    console.warn('❌ Failed with path:', apiPath, error.message);
                    lastError = error;
                    response = null;
                }
            }
            
            if (!response) {
                throw lastError || new Error('هیچ API endpoint در دسترس نیست');
            }
            
            const data = await response.json();
            console.log('📊 AI settings data received:', JSON.stringify(data, null, 2));
            
            if (data.success && data.data) {
                this.populateAIForms(data.data);
                console.log('✅ AI settings loaded successfully');
            } else {
                console.warn('⚠️ No AI settings data found, using defaults');
                this.populateAIForms({});
            }
        } catch (error) {
            console.error('❌ Error loading AI settings:', error);
            
            // Show user-friendly error message
            this.showErrorMessage('خطا در بارگذاری تنظیمات AI. بررسی کنید که سرور XAMPP روشن باشد.');
            
            // Load empty form with defaults
            this.populateAIForms({});
        }
    },
    
    /**
     * پر کردن فرم‌های AI با داده‌ها
     */
    populateAIForms(data) {
        console.log('🔄 populateAIForms called with data:', data);
        
        const defaults = {
            openai_api_key: '',
            ai_model: 'gpt-4o',
            temperature: 0.7,
            max_tokens: 1000,
            tts_service: 'openai',
            voice_selection: 'female',
            speech_speed: 1.0,
            image_generation_service: 'openai'
        };
        
        // Model Settings Tab
        const modelFields = ['openai_api_key', 'ai_model', 'temperature', 'max_tokens'];
        modelFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = data[field]?.value !== undefined ? data[field].value : defaults[field];
                if (element.type === 'range' || element.type === 'number') {
                    element.value = value;
                    // Update display value for range inputs
                    if (field === 'temperature') {
                        document.getElementById('temperatureValue').textContent = value;
                    }
                } else {
                    element.value = value;
                }
            }
        });
        
        // Audio Settings Tab
        const audioFields = ['tts_service', 'voice_selection', 'speech_speed'];
        audioFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = data[field]?.value !== undefined ? data[field].value : defaults[field];
                if (element.type === 'range') {
                    element.value = value;
                    // Update display value for range inputs
                    if (field === 'speech_speed') {
                        document.getElementById('speedValue').textContent = value + 'x';
                    }
                } else {
                    element.value = value;
                }
            }
        });
        
        // Image Settings Tab
        const imageFields = ['image_generation_service'];
        imageFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = data[field]?.value !== undefined ? data[field].value : defaults[field];
                element.value = value;
            }
        });
    },
    
    /**
     * تنظیم مقدار یک select element
     */
    setSelectValue(selectElement, value) {
        if (!selectElement) return;
        
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value == value) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    },
    
    /**
     * نمایش پیام خطا
     */
    showErrorMessage(message) {
        const container = document.createElement('div');
        container.className = 'error-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--error-gradient);
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // حذف پیام خطا پس از 5 ثانیه
        setTimeout(() => {
            container.remove();
        }, 5000);
        
        // دکمه بستن پیام خطا
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
    },
    
    /**
     * نمایش پیام موفقیت
     */
    showSuccessMessage(message) {
        const container = document.createElement('div');
        container.className = 'success-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-gradient, linear-gradient(135deg, #4CAF50, #8BC34A));
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-check-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // حذف پیام پس از 3 ثانیه
        setTimeout(() => {
            container.remove();
        }, 3000);
        
        // دکمه بستن پیام
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
    },
    
    /**
     * ذخیره تنظیمات AI
     */
    async saveAISettings(formData) {
        try {
            console.log('📤 Saving AI settings...', formData);
            
            let response = null;
            let lastError = null;
            
            // Try each path until one works
            for (const apiPath of this.apiPaths) {
                try {
                    console.log('🔍 Trying API path for saving:', apiPath);
                    
                    const requestData = {
                        action: 'save',
                        settings: formData
                    };
                    
                    console.log('📝 Request data:', JSON.stringify(requestData));
                    
                    response = await fetch(apiPath, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    });
                    
                    console.log(`📋 Response status: ${response.status} for path: ${apiPath}`);
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log('📝 Content-Type:', contentType);
                        
                        if (contentType && contentType.includes('application/json')) {
                            break; // Found working API endpoint
                        } else {
                            lastError = new Error(`نوع محتوا نادرست: ${contentType}`);
                            response = null;
                        }
                    } else {
                        // Try to get more information about the error
                        try {
                            // If the response is JSON, parse it for better error info
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                const errorJson = await response.json();
                                console.error(`❌ HTTP Error ${response.status}: JSON response`, errorJson);
                                lastError = new Error(`HTTP ${response.status}: ${errorJson.message || response.statusText}`);
                            } else {
                                const errorText = await response.text();
                                console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`, errorText);
                                lastError = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
                            }
                        } catch (textError) {
                            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        response = null;
                    }
                } catch (error) {
                    console.warn('❌ Failed saving with path:', apiPath, error.message);
                    lastError = error;
                    response = null;
                }
            }
            
            if (!response) {
                throw lastError || new Error('هیچ API endpoint در دسترس نیست');
            }
            
            try {
                const data = await response.json();
                console.log('📊 API response data:', data);
                
                if (data.success) {
                    console.log('✅ AI settings saved successfully');
                    return true;
                } else {
                    throw new Error(data.message || 'خطا در ذخیره تنظیمات');
                }
            } catch (jsonError) {
                console.error('❌ Failed to parse response:', jsonError);
                throw new Error('خطا در پردازش پاسخ سرور');
            }
        } catch (error) {
            console.error('❌ Error saving AI settings:', error);
            this.showErrorMessage('خطا در ذخیره تنظیمات: ' + error.message);
            return false;
        }
    },
    
    /**
     * مقداردهی اولیه تنظیمات هوش مصنوعی
     */
    async init() {
        try {
            console.log('AI Settings module initialized');
            
            // مقداردهی اولیه تب‌ها
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    this.switchTab(tabId);
                });
            });
            
            // مقداردهی اولیه فرم‌های تنظیمات
            document.getElementById('modelSettingsForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleModelFormSubmit(e.target);
            });
            
            document.getElementById('audioSettingsForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAudioFormSubmit(e.target);
            });
            
            document.getElementById('imageSettingsForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleImageFormSubmit(e.target);
            });
            
            // اتصال event listeners برای المان‌های تعاملی
            this.attachEventListeners();
            
            // بارگذاری تنظیمات از دیتابیس
            await this.loadAISettingsData();
            
        } catch (error) {
            console.error('Failed to initialize AI settings:', error);
        }
    },
    
    /**
     * اتصال event listeners
     */
    attachEventListeners() {
        // Range input updates
        const temperatureSlider = document.getElementById('temperature');
        if (temperatureSlider) {
            temperatureSlider.addEventListener('input', (e) => {
                document.getElementById('temperatureValue').textContent = e.target.value;
            });
        }
        
        const speedSlider = document.getElementById('speech_speed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                document.getElementById('speedValue').textContent = e.target.value + 'x';
            });
        }
        
        // Chat simulator
        const sendChatBtn = document.getElementById('sendChatBtn');
        const chatInput = document.getElementById('chatInput');
        if (sendChatBtn && chatInput) {
            sendChatBtn.addEventListener('click', () => {
                this.handleChatMessage(chatInput.value);
                chatInput.value = '';
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleChatMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }
        
        // Audio test buttons
        document.getElementById('testTTSBtn')?.addEventListener('click', () => {
            this.handleTTS();
        });
        
        document.getElementById('testSTTBtn')?.addEventListener('click', () => {
            this.handleSTT();
        });
        
        // Image test buttons
        document.getElementById('generateImageBtn')?.addEventListener('click', () => {
            this.handleImageGeneration();
        });
        
        document.getElementById('analyzeImageBtn')?.addEventListener('click', () => {
            this.handleImageAnalysis();
        });
        
        document.getElementById('ocrBtn')?.addEventListener('click', () => {
            this.handleOCR();
        });
    },
    
    /**
     * تغییر تب
     */
    switchTab(tabId) {
        // غیرفعال کردن همه تب‌ها
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.style.display = 'none';
            pane.classList.remove('active');
        });
        
        // فعال کردن تب موردنظر
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        const activePane = document.getElementById(`${tabId}-tab`);
        if (activePane) {
            activePane.style.display = 'block';
            activePane.classList.add('active');
        }
    },
    
    /**
     * مدیریت ارسال فرم تنظیمات مدل
     */
    async handleModelFormSubmit(form) {
        const formData = {
            openai_api_key: form.openai_api_key.value.trim(),
            ai_model: form.ai_model.value,
            temperature: parseFloat(form.temperature.value),
            max_tokens: parseInt(form.max_tokens.value, 10)
        };
        
        console.log('📦 Model form data:', formData);
        
        const success = await this.saveAISettings(formData);
        if (success) {
            this.showSuccessMessage('تنظیمات مدل با موفقیت ذخیره شد');
        }
    },
    
    /**
     * مدیریت ارسال فرم تنظیمات صوتی
     */
    async handleAudioFormSubmit(form) {
        const formData = {
            tts_service: form.tts_service.value,
            voice_selection: form.voice_selection.value,
            speech_speed: parseFloat(form.speech_speed.value)
        };
        
        console.log('📦 Audio form data:', formData);
        
        const success = await this.saveAISettings(formData);
        if (success) {
            this.showSuccessMessage('تنظیمات صوتی با موفقیت ذخیره شد');
        }
    },
    
    /**
     * مدیریت ارسال فرم تنظیمات تصویری
     */
    async handleImageFormSubmit(form) {
        const formData = {
            image_generation_service: form.image_generation_service.value
        };
        
        console.log('📦 Image form data:', formData);
        
        const success = await this.saveAISettings(formData);
        if (success) {
            this.showSuccessMessage('تنظیمات تصویری با موفقیت ذخیره شد');
        }
    },
    
    /**
     * مدیریت پیام چت
     */
    async handleChatMessage(message) {
        if (!message.trim()) return;
        
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        // حذف پیام placeholder اگر وجود دارد
        if (chatMessages.children.length === 1 && 
            chatMessages.children[0].textContent.includes('پیام‌های چت')) {
            chatMessages.innerHTML = '';
        }
        
        // اضافه کردن پیام کاربر
        const userMessage = document.createElement('div');
        userMessage.style.cssText = `
            background: var(--primary-gradient);
            color: white;
            padding: var(--spacing-3);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-3);
            max-width: 80%;
            margin-left: auto;
        `;
        userMessage.innerHTML = `<strong>شما:</strong> ${message}`;
        chatMessages.appendChild(userMessage);
        
        // اسکرول به آخر
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // دریافت تنظیمات فعلی برای API Key و مدل
        const apiKeyInput = document.getElementById('openai_api_key');
        // استفاده از trim و جایگزین کردن کاراکترهای خاص
        const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
        const model = document.getElementById('ai_model')?.value || 'gpt-4o';
        
        // برای دیباگ - نمایش بخشی از کلید (فقط برای دیباگ)
        console.log('Debug - API Key length:', apiKey.length);
        console.log('Debug - API Key sample:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
        
        if (!apiKey) {
            // اضافه کردن پیام خطا
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                background: var(--glass-bg-lighter);
                color: var(--error-color, #dc2626);
                padding: var(--spacing-3);
                border-radius: var(--radius-md);
                margin-bottom: var(--spacing-3);
                max-width: 80%;
            `;
            errorMessage.innerHTML = `<strong>خطا:</strong> لطفاً کلید API OpenAI را در تنظیمات وارد کنید.`;
            chatMessages.appendChild(errorMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return;
        }
        
        // اضافه کردن پیام "در حال تایپ"
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typingIndicator';
        typingIndicator.style.cssText = `
            background: var(--glass-bg-lighter);
            color: var(--text-primary);
            padding: var(--spacing-3);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-3);
            max-width: 80%;
        `;
        typingIndicator.innerHTML = `<strong>ربات:</strong> <span id="typingText">در حال تایپ</span>`;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // ایجاد انیمیشن تایپ
        this.animateTyping();
        
        try {
            // فراخوانی API OpenAI برای دریافت پاسخ
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{role: "user", content: message}],
                    temperature: parseFloat(document.getElementById('temperature')?.value) || 0.7,
                    max_tokens: parseInt(document.getElementById('max_tokens')?.value) || 1000
                })
            });
            
            // حذف نشانگر تایپ
            if (typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI API Error Response:', errorText);
                throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const botResponse = data.choices[0]?.message?.content || "پاسخی دریافت نشد.";
            
            // اضافه کردن پیام ربات
            const botMessage = document.createElement('div');
            botMessage.style.cssText = `
                background: var(--glass-bg-lighter);
                color: var(--text-primary);
                padding: var(--spacing-3);
                border-radius: var(--radius-md);
                margin-bottom: var(--spacing-3);
                max-width: 80%;
            `;
            botMessage.innerHTML = `<strong>ربات:</strong> ${botResponse}`;
            chatMessages.appendChild(botMessage);
            
        } catch (error) {
            // حذف نشانگر تایپ
            if (typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            // اضافه کردن پیام خطا
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                background: var(--glass-bg-lighter);
                color: var(--error-color, #dc2626);
                padding: var(--spacing-3);
                border-radius: var(--radius-md);
                margin-bottom: var(--spacing-3);
                max-width: 80%;
            `;
            errorMessage.innerHTML = `<strong>خطا:</strong> ${error.message}`;
            chatMessages.appendChild(errorMessage);
        }
        
        // اسکرول به آخر
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    /**
     * انیمیشن تایپ
     */
    animateTyping() {
        const typingText = document.getElementById('typingText');
        if (!typingText) return;
        
        let dots = 0;
        this.typingInterval = setInterval(() => {
            dots = (dots % 3) + 1;
            typingText.textContent = 'در حال تایپ' + '.'.repeat(dots);
        }, 500);
    },
    
    /**
     * توقف انیمیشن تایپ
     */
    stopTypingAnimation() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
    },
    
    /**
     * تست TTS
     */
    async handleTTS() {
        const testText = document.getElementById('testText')?.value;
        if (!testText) {
            this.showErrorMessage('لطفاً متنی برای تبدیل به صوت وارد کنید');
            return;
        }
        
        // دریافت تنظیمات فعلی
        const apiKeyInput = document.getElementById('openai_api_key');
        // استفاده از trim و جایگزین کردن کاراکترهای خاص
        const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
        const ttsService = document.getElementById('tts_service')?.value || 'openai';
        const voice = document.getElementById('voice_selection')?.value || 'female';
        const speed = parseFloat(document.getElementById('speech_speed')?.value) || 1.0;
        
        // برای دیباگ - نمایش بخشی از کلید (فقط برای دیباگ)
        console.log('Debug - TTS API Key length:', apiKey.length);
        console.log('Debug - TTS API Key sample:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
        
        if (!apiKey) {
            this.showErrorMessage('لطفاً کلید API را در تنظیمات وارد کنید');
            return;
        }
        
        try {
            this.showInfoMessage('در حال تبدیل متن به صوت...');
            
            if (ttsService === 'openai') {
                // فراخوانی API OpenAI TTS
                const response = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'tts-1',
                        input: testText,
                        voice: voice === 'male' ? 'onyx' : 'nova', // OpenAI voice mappings
                        speed: speed
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('OpenAI TTS API Error Response:', errorText);
                    throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
                }
                
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                
                const audioPlayer = document.getElementById('audioPlayer');
                if (audioPlayer) {
                    audioPlayer.src = audioUrl;
                    audioPlayer.play();
                }
                
                this.showSuccessMessage('تبدیل متن به صوت با موفقیت انجام شد');
            } else if (ttsService === 'google') {
                // فراخوانی API Google TTS
                // Note: This is a simplified implementation. In a real application,
                // you would need to use the Google Cloud Text-to-Speech API
                this.showErrorMessage('سرویس Google TTS هنوز پیاده‌سازی نشده است');
            }
            
        } catch (error) {
            this.showErrorMessage('خطا در تبدیل متن به صوت: ' + error.message);
        }
    },
    
    /**
     * نمایش پیام اطلاعات
     */
    showInfoMessage(message) {
        const container = document.createElement('div');
        container.className = 'info-message';
        container.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--info-gradient, linear-gradient(135deg, #2196F3, #03A9F4));
            color: white;
            padding: var(--spacing-4);
            border-radius: var(--radius-lg);
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-3);">
                <i class="fas fa-info-circle" style="font-size: 24px;"></i>
                <p style="margin: 0;">${message}</p>
            </div>
            <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(container);
        
        // دکمه بستن پیام
        const closeButton = container.querySelector('button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.remove();
            });
        }
        
        return container;
    },
    
    /**
     * تست STT
     */
    async handleSTT() {
        try {
            // دریافت تنظیمات فعلی
            const apiKeyInput = document.getElementById('openai_api_key');
            const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
            const ttsService = document.getElementById('tts_service')?.value || 'openai';
            
            if (!apiKey) {
                this.showErrorMessage('لطفاً کلید API را در تنظیمات وارد کنید');
                return;
            }
            
            if (ttsService === 'google') {
                this.showErrorMessage('سرویس Google STT هنوز پیاده‌سازی نشده است');
                return;
            }
            
            // نمایش پیام اطلاعات
            const infoMessage = this.showInfoMessage('در حال دسترسی به میکروفون...');
            
            // دریافت دسترسی به میکروفون
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // حذف پیام اطلاعات
            if (infoMessage && infoMessage.parentNode) {
                infoMessage.parentNode.removeChild(infoMessage);
            }
            
            this.showInfoMessage('در حال ضبط صدا... (برای توقف ضبط، دکمه را دوباره بزنید)');
            
            // ایجاد MediaRecorder برای ضبط صدا
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = async () => {
                // توقف استریم میکروفون
                stream.getTracks().forEach(track => track.stop());
                
                // ایجاد Blob از داده‌های صوتی
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                
                try {
                    this.showInfoMessage('در حال تبدیل صدا به متن...');
                    
                    // ایجاد FormData برای ارسال فایل صوتی
                    const formData = new FormData();
                    formData.append('file', audioBlob, 'recording.webm');
                    formData.append('model', 'whisper-1');
                    
                    // فراخوانی API OpenAI Whisper
                    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: formData
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('OpenAI STT API Error Response:', errorText);
                        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
                    }
                    
                    const data = await response.json();
                    const transcript = data.text;
                    
                    // نمایش متن استخراج شده در textarea
                    const testText = document.getElementById('testText');
                    if (testText) {
                        testText.value = transcript;
                    }
                    
                    this.showSuccessMessage('تبدیل صدا به متن با موفقیت انجام شد');
                    
                } catch (error) {
                    this.showErrorMessage('خطا در تبدیل صدا به متن: ' + error.message);
                }
            };
            
            // شروع ضبط
            mediaRecorder.start();
            
            // توقف ضبط بعد از 5 ثانیه یا با کلیک دوباره روی دکمه
            let isRecording = true;
            const stopRecording = () => {
                if (isRecording) {
                    mediaRecorder.stop();
                    isRecording = false;
                    
                    // حذف event listener
                    document.getElementById('testSTTBtn').removeEventListener('click', stopRecording);
                }
            };
            
            // اضافه کردن event listener برای توقف ضبط
            document.getElementById('testSTTBtn').addEventListener('click', stopRecording);
            
            // توقف خودکار بعد از 10 ثانیه
            setTimeout(stopRecording, 10000);
            
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                this.showErrorMessage('دسترسی به میکروفون رد شد. لطفاً دسترسی به میکروفون را فعال کنید.');
            } else {
                this.showErrorMessage('خطا در دسترسی به میکروفون: ' + error.message);
            }
        }
    },
    
    /**
     * تولید تصویر
     */
    async handleImageGeneration() {
        const prompt = document.getElementById('imagePrompt')?.value;
        if (!prompt) {
            this.showErrorMessage('لطفاً توضیح تصویر مورد نظر خود را وارد کنید');
            return;
        }
        
        // دریافت تنظیمات فعلی
        const apiKeyInput = document.getElementById('openai_api_key');
        // استفاده از trim و جایگزین کردن کاراکترهای خاص
        const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
        const service = document.getElementById('image_generation_service')?.value || 'openai';
        
        // برای دیباگ - نمایش بخشی از کلید (فقط برای دیباگ)
        console.log('Debug - Image API Key length:', apiKey.length);
        console.log('Debug - Image API Key sample:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
        
        if (!apiKey) {
            this.showErrorMessage('لطفاً کلید API OpenAI را در تنظیمات وارد کنید');
            return;
        }
        
        if (service !== 'openai') {
            this.showErrorMessage('در حال حاضر فقط سرویس OpenAI پشتیبانی می‌شود');
            return;
        }
        
        try {
            this.showInfoMessage('در حال تولید تصویر...');
            
            // فراخوانی API OpenAI DALL-E
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024'
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('OpenAI Image API Error Response:', errorText);
                throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const imageUrl = data.data[0]?.url;
            
            if (!imageUrl) {
                throw new Error('آدرس تصویر دریافت نشد');
            }
            
            const container = document.getElementById('generatedImageContainer');
            if (container) {
                container.innerHTML = `
                    <img src="${imageUrl}" alt="تصویر تولید شده" style="max-width: 100%; border-radius: var(--radius-md);">
                `;
            }
            
            this.showSuccessMessage('تصویر با موفقیت تولید شد');
            
        } catch (error) {
            this.showErrorMessage('خطا در تولید تصویر: ' + error.message);
        }
    },
    
    /**
     * تحلیل تصویر
     */
    async handleImageAnalysis() {
        const fileInput = document.getElementById('imageToAnalyze');
        if (!fileInput || !fileInput.files.length) {
            this.showErrorMessage('لطفاً یک تصویر برای تحلیل انتخاب کنید');
            return;
        }
        
        // دریافت تنظیمات فعلی
        const apiKeyInput = document.getElementById('openai_api_key');
        const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
        
        if (!apiKey) {
            this.showErrorMessage('لطفاً کلید API OpenAI را در تنظیمات وارد کنید');
            return;
        }
        
        const file = fileInput.files[0];
        
        try {
            this.showInfoMessage('در حال تحلیل تصویر...');
            
            // تبدیل تصویر به base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result.split(',')[1]; // حذف پیشوند data:image
                
                // فراخوانی API OpenAI Vision
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'لطفاً این تصویر را تحلیل کنید و توضیح دهید چه چیزی در آن دیده می‌شود. پاسخ خود را به زبان فارسی بدهید.'
                                    },
                                    {
                                        type: 'image_url',
                                        image_url: {
                                            url: `data:image/jpeg;base64,${base64Image}`
                                        }
                                    }
                                ]
                            }
                        ],
                        max_tokens: 500
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('OpenAI Vision API Error Response:', errorText);
                    throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
                }
                
                const data = await response.json();
                const analysis = data.choices[0]?.message?.content || 'تحلیلی انجام نشد.';
                
                const resultContainer = document.getElementById('imageAnalysisResult');
                if (resultContainer) {
                    resultContainer.innerHTML = `
                        <p><strong>نتیجه تحلیل تصویر:</strong></p>
                        <p>${analysis}</p>
                    `;
                }
                
                this.showSuccessMessage('تحلیل تصویر با موفقیت انجام شد');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            this.showErrorMessage('خطا در تحلیل تصویر: ' + error.message);
        }
    },
    
    /**
     * OCR
     */
    async handleOCR() {
        const fileInput = document.getElementById('imageForOCR');
        if (!fileInput || !fileInput.files.length) {
            this.showErrorMessage('لطفاً یک تصویر برای استخراج متن انتخاب کنید');
            return;
        }
        
        // دریافت تنظیمات فعلی
        const apiKeyInput = document.getElementById('openai_api_key');
        const apiKey = apiKeyInput?.value ? apiKeyInput.value.trim().replace(/\s/g, '') : '';
        
        if (!apiKey) {
            this.showErrorMessage('لطفاً کلید API OpenAI را در تنظیمات وارد کنید');
            return;
        }
        
        const file = fileInput.files[0];
        
        try {
            this.showInfoMessage('در حال استخراج متن از تصویر...');
            
            // تبدیل تصویر به base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result.split(',')[1]; // حذف پیشوند data:image
                
                // فراخوانی API OpenAI Vision برای OCR
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'لطفاً متن موجود در این تصویر را استخراج کنید و به زبان فارسی به من بدهید. فقط متن را بنویسید و هیچ توضیح اضافی ندهید.'
                                    },
                                    {
                                        type: 'image_url',
                                        image_url: {
                                            url: `data:image/jpeg;base64,${base64Image}`
                                        }
                                    }
                                ]
                            }
                        ],
                        max_tokens: 1000
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('OpenAI OCR API Error Response:', errorText);
                    throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
                }
                
                const data = await response.json();
                const extractedText = data.choices[0]?.message?.content || 'متنی استخراج نشد.';
                
                const resultContainer = document.getElementById('ocrResult');
                if (resultContainer) {
                    resultContainer.innerHTML = `
                        <p><strong>متن استخراج شده:</strong></p>
                        <p>${extractedText}</p>
                    `;
                }
                
                this.showSuccessMessage('استخراج متن از تصویر با موفقیت انجام شد');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            this.showErrorMessage('خطا در استخراج متن از تصویر: ' + error.message);
        }
    }
};