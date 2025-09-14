/**
 * ماژول کامپوننت‌های نمودار
 * Charts Component Module
 * 
 * @description: ماژول ایجاد و مدیریت نمودارها
 * @version: 1.0.0
 * @author: DataSave Team
 */

'use strict';

/**
 * ماژول نمودارها
 * Charts Module
 */
export default {
    /**
     * ایجاد یک نمودار ستونی
     * 
     * @param {Object} options - تنظیمات نمودار
     * @returns {HTMLElement} - المنت نمودار
     */
    createBarChart(options = {}) {
        const {
            id = 'chart-' + Date.now(),
            title = '',
            data = [],
            labels = [],
            colors = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585'],
            height = 300,
            width = '100%',
            direction = 'vertical', // vertical, horizontal
            stacked = false,
            showLegend = true,
            showValues = true,
            maxValue = null,
            animation = true,
            formatter = value => value
        } = options;
        
        // ایجاد المنت نمودار
        const chartElement = document.createElement('div');
        chartElement.className = 'chart-container';
        chartElement.id = id;
        chartElement.style = `
            width: ${typeof width === 'number' ? width + 'px' : width};
            height: ${typeof height === 'number' ? height + 'px' : height};
            position: relative;
            padding: var(--spacing-4);
            background: var(--glass-bg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--glass-border);
        `;
        
        // اضافه کردن عنوان
        if (title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'chart-title';
            titleElement.style = `
                font-size: var(--font-size-lg);
                font-weight: 600;
                margin-bottom: var(--spacing-4);
                text-align: center;
            `;
            titleElement.textContent = title;
            chartElement.appendChild(titleElement);
        }
        
        // ایجاد مقدار ماکزیمم
        const dataValues = data.flat();
        let max = maxValue || Math.max(...dataValues, 1) * 1.1;
        
        // تعیین تعداد خطوط افقی
        const gridLines = 5;
        const gridStep = max / gridLines;
        
        // ایجاد محتوای نمودار
        const chartContent = document.createElement('div');
        chartContent.className = 'chart-content';
        chartContent.style = `
            display: flex;
            flex-direction: ${direction === 'vertical' ? 'row' : 'column'};
            height: calc(100% - ${title ? '60px' : '20px'});
            position: relative;
            padding-bottom: ${direction === 'vertical' ? '30px' : '0'};
            padding-${direction === 'vertical' ? 'right' : 'bottom'}: 40px;
        `;
        
        // ایجاد خطوط افقی
        for (let i = 0; i <= gridLines; i++) {
            const value = max - (i * gridStep);
            const percent = (i * (100 / gridLines));
            
            const gridLine = document.createElement('div');
            gridLine.className = 'chart-grid-line';
            gridLine.style = `
                position: absolute;
                ${direction === 'vertical' ? 'left: 0; right: 40px; top:' : 'top: 0; bottom: 40px; right:'}
                ${percent}%;
                height: ${direction === 'vertical' ? '1px' : '100%'};
                width: ${direction === 'vertical' ? '100%' : '1px'};
                background-color: var(--glass-border-lighter);
                z-index: 1;
            `;
            chartContent.appendChild(gridLine);
            
            // اضافه کردن مقدار به خط
            const gridValue = document.createElement('div');
            gridValue.className = 'chart-grid-value';
            gridValue.style = `
                position: absolute;
                ${direction === 'vertical' ? 'right: 0; top:' : 'bottom: 0; right:'}
                ${percent}%;
                transform: translate(${direction === 'vertical' ? '0, -50%' : '-50%, 0'});
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                z-index: 2;
            `;
            gridValue.textContent = formatter(Math.round(value));
            chartContent.appendChild(gridValue);
        }
        
        // ایجاد ستون‌ها یا سطرهای نمودار
        const isMultiSeries = Array.isArray(data[0]);
        const barWidth = `calc((100% / ${labels.length}) - ${isMultiSeries ? '15px' : '10px'})`;
        const innerBarWidth = isMultiSeries ? `calc((100% / ${data.length}) - 4px)` : '100%';
        
        labels.forEach((label, index) => {
            const barGroup = document.createElement('div');
            barGroup.className = 'chart-bar-group';
            barGroup.style = `
                display: flex;
                flex-direction: ${direction === 'vertical' ? 'column-reverse' : 'row'};
                align-items: flex-end;
                justify-content: flex-end;
                position: relative;
                ${direction === 'vertical' ? 'width:' : 'height:'} ${barWidth};
                margin: 0 5px;
                height: ${direction === 'vertical' ? '100%' : 'auto'};
                width: ${direction === 'vertical' ? 'auto' : '100%'};
            `;
            
            // اضافه کردن برچسب به ستون یا سطر
            const barLabel = document.createElement('div');
            barLabel.className = 'chart-bar-label';
            barLabel.style = `
                position: absolute;
                ${direction === 'vertical' ? 'bottom: -25px; left: 50%; transform: translateX(-50%);' : 'left: -5px; top: 50%; transform: translateY(-50%) rotate(-90deg); transform-origin: left center;'}
                font-size: var(--font-size-sm);
                text-align: center;
                color: var(--text-secondary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: ${direction === 'vertical' ? '100%' : '100px'};
            `;
            barLabel.textContent = label;
            barGroup.appendChild(barLabel);
            
            // اضافه کردن ستون‌ها یا سطرهای داده
            if (isMultiSeries) {
                // چند سری داده
                let stackedValue = 0;
                
                data.forEach((series, seriesIndex) => {
                    const value = series[index] || 0;
                    const height = (value / max) * 100;
                    const color = colors[seriesIndex % colors.length];
                    
                    const bar = document.createElement('div');
                    bar.className = 'chart-bar';
                    bar.style = `
                        ${direction === 'vertical' ? 'height:' : 'width:'} ${height}%;
                        ${direction === 'vertical' ? 'width:' : 'height:'} ${innerBarWidth};
                        ${stacked ? `position: absolute; ${direction === 'vertical' ? 'bottom' : 'left'}: ${stackedValue}%;` : ''}
                        background: ${color};
                        ${!stacked ? `margin: 0 2px;` : ''}
                        transition: all 0.5s ease;
                        position: relative;
                        border-radius: ${direction === 'vertical' ? '4px 4px 0 0' : '0 4px 4px 0'};
                        ${animation ? (direction === 'vertical' ? 'transform: scaleY(0); transform-origin: bottom;' : 'transform: scaleX(0); transform-origin: left;') : ''}
                    `;
                    
                    // اضافه کردن مقدار به ستون یا سطر
                    if (showValues) {
                        const barValue = document.createElement('div');
                        barValue.className = 'chart-bar-value';
                        barValue.style = `
                            position: absolute;
                            ${direction === 'vertical' ? 'top: -20px; left: 50%; transform: translateX(-50%);' : 'right: -35px; top: 50%; transform: translateY(-50%);'}
                            font-size: var(--font-size-sm);
                            color: var(--text);
                            white-space: nowrap;
                        `;
                        barValue.textContent = formatter(value);
                        bar.appendChild(barValue);
                    }
                    
                    barGroup.appendChild(bar);
                    
                    if (stacked) {
                        stackedValue += height;
                    }
                    
                    // انیمیشن ظاهر شدن با تاخیر
                    if (animation) {
                        setTimeout(() => {
                            bar.style.transform = 'scale(1)';
                        }, (seriesIndex * 100) + (index * 50));
                    }
                });
            } else {
                // تک سری داده
                const value = data[index] || 0;
                const height = (value / max) * 100;
                const color = colors[index % colors.length];
                
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style = `
                    ${direction === 'vertical' ? 'height:' : 'width:'} ${height}%;
                    ${direction === 'vertical' ? 'width:' : 'height:'} 100%;
                    background: ${color};
                    transition: all 0.5s ease;
                    position: relative;
                    border-radius: ${direction === 'vertical' ? '4px 4px 0 0' : '0 4px 4px 0'};
                    ${animation ? (direction === 'vertical' ? 'transform: scaleY(0); transform-origin: bottom;' : 'transform: scaleX(0); transform-origin: left;') : ''}
                `;
                
                // اضافه کردن مقدار به ستون یا سطر
                if (showValues) {
                    const barValue = document.createElement('div');
                    barValue.className = 'chart-bar-value';
                    barValue.style = `
                        position: absolute;
                        ${direction === 'vertical' ? 'top: -20px; left: 50%; transform: translateX(-50%);' : 'right: -35px; top: 50%; transform: translateY(-50%);'}
                        font-size: var(--font-size-sm);
                        color: var(--text);
                        white-space: nowrap;
                    `;
                    barValue.textContent = formatter(value);
                    bar.appendChild(barValue);
                }
                
                barGroup.appendChild(bar);
                
                // انیمیشن ظاهر شدن با تاخیر
                if (animation) {
                    setTimeout(() => {
                        bar.style.transform = 'scale(1)';
                    }, index * 100);
                }
            }
            
            chartContent.appendChild(barGroup);
        });
        
        chartElement.appendChild(chartContent);
        
        // اضافه کردن راهنما
        if (showLegend && isMultiSeries) {
            const legendElement = document.createElement('div');
            legendElement.className = 'chart-legend';
            legendElement.style = `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: var(--spacing-4);
                gap: var(--spacing-3);
            `;
            
            // اگر سری‌های داده دارای نام باشند
            if (options.series) {
                options.series.forEach((series, index) => {
                    const color = colors[index % colors.length];
                    const legendItem = document.createElement('div');
                    legendItem.className = 'chart-legend-item';
                    legendItem.style = `
                        display: flex;
                        align-items: center;
                        margin-left: var(--spacing-3);
                    `;
                    
                    const legendColor = document.createElement('div');
                    legendColor.style = `
                        width: 12px;
                        height: 12px;
                        background: ${color};
                        margin-left: var(--spacing-2);
                        border-radius: 2px;
                    `;
                    
                    const legendText = document.createElement('span');
                    legendText.style = `
                        font-size: var(--font-size-sm);
                        color: var(--text);
                    `;
                    legendText.textContent = series.name || `سری ${index + 1}`;
                    
                    legendItem.appendChild(legendColor);
                    legendItem.appendChild(legendText);
                    legendElement.appendChild(legendItem);
                });
            } else {
                // حالت پیش‌فرض
                for (let i = 0; i < data.length; i++) {
                    const color = colors[i % colors.length];
                    const legendItem = document.createElement('div');
                    legendItem.className = 'chart-legend-item';
                    legendItem.style = `
                        display: flex;
                        align-items: center;
                        margin-left: var(--spacing-3);
                    `;
                    
                    const legendColor = document.createElement('div');
                    legendColor.style = `
                        width: 12px;
                        height: 12px;
                        background: ${color};
                        margin-left: var(--spacing-2);
                        border-radius: 2px;
                    `;
                    
                    const legendText = document.createElement('span');
                    legendText.style = `
                        font-size: var(--font-size-sm);
                        color: var(--text);
                    `;
                    legendText.textContent = `سری ${i + 1}`;
                    
                    legendItem.appendChild(legendColor);
                    legendItem.appendChild(legendText);
                    legendElement.appendChild(legendItem);
                }
            }
            
            chartElement.appendChild(legendElement);
        }
        
        return chartElement;
    },
    
    /**
     * ایجاد یک نمودار خطی
     * 
     * @param {Object} options - تنظیمات نمودار
     * @returns {HTMLElement} - المنت نمودار
     */
    createLineChart(options = {}) {
        const {
            id = 'chart-' + Date.now(),
            title = '',
            data = [],
            labels = [],
            colors = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585'],
            height = 300,
            width = '100%',
            showLegend = true,
            showValues = false,
            showPoints = true,
            fillArea = false,
            maxValue = null,
            animation = true,
            formatter = value => value
        } = options;
        
        // ایجاد المنت نمودار
        const chartElement = document.createElement('div');
        chartElement.className = 'chart-container';
        chartElement.id = id;
        chartElement.style = `
            width: ${typeof width === 'number' ? width + 'px' : width};
            height: ${typeof height === 'number' ? height + 'px' : height};
            position: relative;
            padding: var(--spacing-4);
            background: var(--glass-bg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--glass-border);
        `;
        
        // اضافه کردن عنوان
        if (title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'chart-title';
            titleElement.style = `
                font-size: var(--font-size-lg);
                font-weight: 600;
                margin-bottom: var(--spacing-4);
                text-align: center;
            `;
            titleElement.textContent = title;
            chartElement.appendChild(titleElement);
        }
        
        // ایجاد مقدار ماکزیمم
        const dataValues = data.flat();
        let max = maxValue || Math.max(...dataValues, 1) * 1.1;
        
        // تعیین تعداد خطوط افقی
        const gridLines = 5;
        const gridStep = max / gridLines;
        
        // ایجاد محتوای نمودار
        const chartContent = document.createElement('div');
        chartContent.className = 'chart-content';
        chartContent.style = `
            display: flex;
            flex-direction: column;
            height: calc(100% - ${title ? '60px' : '20px'} - ${showLegend ? '40px' : '0px'});
            position: relative;
            padding-bottom: 30px;
            padding-right: 40px;
        `;
        
        // ایجاد خطوط افقی
        for (let i = 0; i <= gridLines; i++) {
            const value = max - (i * gridStep);
            const percent = (i * (100 / gridLines));
            
            const gridLine = document.createElement('div');
            gridLine.className = 'chart-grid-line';
            gridLine.style = `
                position: absolute;
                left: 0;
                right: 40px;
                top: ${percent}%;
                height: 1px;
                background-color: var(--glass-border-lighter);
                z-index: 1;
            `;
            chartContent.appendChild(gridLine);
            
            // اضافه کردن مقدار به خط
            const gridValue = document.createElement('div');
            gridValue.className = 'chart-grid-value';
            gridValue.style = `
                position: absolute;
                right: 0;
                top: ${percent}%;
                transform: translate(0, -50%);
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                z-index: 2;
            `;
            gridValue.textContent = formatter(Math.round(value));
            chartContent.appendChild(gridValue);
        }
        
        // ایجاد خطوط عمودی و برچسب‌ها
        for (let i = 0; i < labels.length; i++) {
            const percent = (i / (labels.length - 1)) * 100;
            
            const gridLine = document.createElement('div');
            gridLine.className = 'chart-grid-line';
            gridLine.style = `
                position: absolute;
                left: ${percent}%;
                top: 0;
                bottom: 0;
                width: 1px;
                background-color: var(--glass-border-lighter);
                z-index: 1;
            `;
            chartContent.appendChild(gridLine);
            
            // اضافه کردن برچسب
            const gridLabel = document.createElement('div');
            gridLabel.className = 'chart-grid-label';
            gridLabel.style = `
                position: absolute;
                left: ${percent}%;
                bottom: -25px;
                transform: translateX(-50%);
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
                z-index: 2;
                text-align: center;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            gridLabel.textContent = labels[i];
            chartContent.appendChild(gridLabel);
        }
        
        // ایجاد SVG برای نمودار خطی
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.right = '40px';
        svg.style.bottom = '30px';
        svg.style.zIndex = '3';
        
        // تعیین آیا چند سری داده داریم یا خیر
        const isMultiSeries = Array.isArray(data[0]);
        
        if (isMultiSeries) {
            // چند سری داده
            data.forEach((series, seriesIndex) => {
                const color = colors[seriesIndex % colors.length];
                const points = [];
                
                // ایجاد مسیر خط
                const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let pathData = '';
                
                // ایجاد مسیر ناحیه پر شده
                let areaPath = null;
                if (fillArea) {
                    areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    areaPath.setAttribute('fill', color);
                    areaPath.setAttribute('opacity', '0.2');
                    areaPath.setAttribute('stroke', 'none');
                }
                
                // محاسبه نقاط
                for (let i = 0; i < series.length; i++) {
                    const value = series[i] || 0;
                    const x = (i / (series.length - 1)) * 100;
                    const y = 100 - ((value / max) * 100);
                    
                    points.push({ x, y, value });
                    
                    if (i === 0) {
                        pathData = `M ${x}% ${y}%`;
                        if (fillArea) {
                            areaPath.setAttribute('d', `M ${x}% ${y}% L ${x}% 100%`);
                        }
                    } else {
                        pathData += ` L ${x}% ${y}%`;
                        if (fillArea && i === series.length - 1) {
                            areaPath.setAttribute('d', areaPath.getAttribute('d') + ` L ${x}% ${y}% L ${x}% 100% L 0% 100% Z`);
                        }
                    }
                }
                
                // تنظیم ویژگی‌های مسیر
                linePath.setAttribute('d', pathData);
                linePath.setAttribute('stroke', color);
                linePath.setAttribute('stroke-width', '2');
                linePath.setAttribute('fill', 'none');
                linePath.setAttribute('stroke-dasharray', animation ? linePath.getTotalLength() : '0');
                linePath.setAttribute('stroke-dashoffset', animation ? linePath.getTotalLength() : '0');
                
                // انیمیشن خط
                if (animation) {
                    setTimeout(() => {
                        linePath.style.transition = 'stroke-dashoffset 1s ease';
                        linePath.setAttribute('stroke-dashoffset', '0');
                    }, seriesIndex * 500);
                }
                
                // اضافه کردن مسیر به SVG
                if (fillArea) {
                    svg.appendChild(areaPath);
                }
                svg.appendChild(linePath);
                
                // ایجاد نقاط
                if (showPoints) {
                    points.forEach((point, pointIndex) => {
                        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        circle.setAttribute('cx', `${point.x}%`);
                        circle.setAttribute('cy', `${point.y}%`);
                        circle.setAttribute('r', '4');
                        circle.setAttribute('fill', color);
                        circle.setAttribute('stroke', 'white');
                        circle.setAttribute('stroke-width', '2');
                        
                        if (animation) {
                            circle.style.opacity = '0';
                            setTimeout(() => {
                                circle.style.transition = 'opacity 0.3s ease';
                                circle.style.opacity = '1';
                            }, (seriesIndex * 500) + (pointIndex * 100) + 500);
                        }
                        
                        svg.appendChild(circle);
                        
                        // اضافه کردن مقدار به نقطه
                        if (showValues) {
                            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            text.setAttribute('x', `${point.x}%`);
                            text.setAttribute('y', `${point.y - 10}%`);
                            text.setAttribute('text-anchor', 'middle');
                            text.setAttribute('font-size', '12');
                            text.setAttribute('fill', 'var(--text)');
                            text.textContent = formatter(point.value);
                            
                            if (animation) {
                                text.style.opacity = '0';
                                setTimeout(() => {
                                    text.style.transition = 'opacity 0.3s ease';
                                    text.style.opacity = '1';
                                }, (seriesIndex * 500) + (pointIndex * 100) + 700);
                            }
                            
                            svg.appendChild(text);
                        }
                    });
                }
            });
        } else {
            // تک سری داده
            const color = colors[0];
            const points = [];
            
            // ایجاد مسیر خط
            const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let pathData = '';
            
            // ایجاد مسیر ناحیه پر شده
            let areaPath = null;
            if (fillArea) {
                areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                areaPath.setAttribute('fill', color);
                areaPath.setAttribute('opacity', '0.2');
                areaPath.setAttribute('stroke', 'none');
            }
            
            // محاسبه نقاط
            for (let i = 0; i < data.length; i++) {
                const value = data[i] || 0;
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - ((value / max) * 100);
                
                points.push({ x, y, value });
                
                if (i === 0) {
                    pathData = `M ${x}% ${y}%`;
                    if (fillArea) {
                        areaPath.setAttribute('d', `M ${x}% ${y}% L ${x}% 100%`);
                    }
                } else {
                    pathData += ` L ${x}% ${y}%`;
                    if (fillArea && i === data.length - 1) {
                        areaPath.setAttribute('d', areaPath.getAttribute('d') + ` L ${x}% ${y}% L ${x}% 100% L 0% 100% Z`);
                    }
                }
            }
            
            // تنظیم ویژگی‌های مسیر
            linePath.setAttribute('d', pathData);
            linePath.setAttribute('stroke', color);
            linePath.setAttribute('stroke-width', '2');
            linePath.setAttribute('fill', 'none');
            
            if (animation) {
                linePath.setAttribute('stroke-dasharray', linePath.getTotalLength());
                linePath.setAttribute('stroke-dashoffset', linePath.getTotalLength());
                setTimeout(() => {
                    linePath.style.transition = 'stroke-dashoffset 1s ease';
                    linePath.setAttribute('stroke-dashoffset', '0');
                }, 100);
            }
            
            // اضافه کردن مسیر به SVG
            if (fillArea) {
                svg.appendChild(areaPath);
            }
            svg.appendChild(linePath);
            
            // ایجاد نقاط
            if (showPoints) {
                points.forEach((point, pointIndex) => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', `${point.x}%`);
                    circle.setAttribute('cy', `${point.y}%`);
                    circle.setAttribute('r', '4');
                    circle.setAttribute('fill', color);
                    circle.setAttribute('stroke', 'white');
                    circle.setAttribute('stroke-width', '2');
                    
                    if (animation) {
                        circle.style.opacity = '0';
                        setTimeout(() => {
                            circle.style.transition = 'opacity 0.3s ease';
                            circle.style.opacity = '1';
                        }, (pointIndex * 100) + 500);
                    }
                    
                    svg.appendChild(circle);
                    
                    // اضافه کردن مقدار به نقطه
                    if (showValues) {
                        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        text.setAttribute('x', `${point.x}%`);
                        text.setAttribute('y', `${point.y - 10}%`);
                        text.setAttribute('text-anchor', 'middle');
                        text.setAttribute('font-size', '12');
                        text.setAttribute('fill', 'var(--text)');
                        text.textContent = formatter(point.value);
                        
                        if (animation) {
                            text.style.opacity = '0';
                            setTimeout(() => {
                                text.style.transition = 'opacity 0.3s ease';
                                text.style.opacity = '1';
                            }, (pointIndex * 100) + 700);
                        }
                        
                        svg.appendChild(text);
                    }
                });
            }
        }
        
        chartContent.appendChild(svg);
        chartElement.appendChild(chartContent);
        
        // اضافه کردن راهنما
        if (showLegend && isMultiSeries) {
            const legendElement = document.createElement('div');
            legendElement.className = 'chart-legend';
            legendElement.style = `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: var(--spacing-4);
                gap: var(--spacing-3);
            `;
            
            // اگر سری‌های داده دارای نام باشند
            if (options.series) {
                options.series.forEach((series, index) => {
                    const color = colors[index % colors.length];
                    const legendItem = document.createElement('div');
                    legendItem.className = 'chart-legend-item';
                    legendItem.style = `
                        display: flex;
                        align-items: center;
                        margin-left: var(--spacing-3);
                    `;
                    
                    const legendColor = document.createElement('div');
                    legendColor.style = `
                        width: 12px;
                        height: 12px;
                        background: ${color};
                        margin-left: var(--spacing-2);
                        border-radius: 2px;
                    `;
                    
                    const legendText = document.createElement('span');
                    legendText.style = `
                        font-size: var(--font-size-sm);
                        color: var(--text);
                    `;
                    legendText.textContent = series.name || `سری ${index + 1}`;
                    
                    legendItem.appendChild(legendColor);
                    legendItem.appendChild(legendText);
                    legendElement.appendChild(legendItem);
                });
            } else {
                // حالت پیش‌فرض
                for (let i = 0; i < data.length; i++) {
                    const color = colors[i % colors.length];
                    const legendItem = document.createElement('div');
                    legendItem.className = 'chart-legend-item';
                    legendItem.style = `
                        display: flex;
                        align-items: center;
                        margin-left: var(--spacing-3);
                    `;
                    
                    const legendColor = document.createElement('div');
                    legendColor.style = `
                        width: 12px;
                        height: 12px;
                        background: ${color};
                        margin-left: var(--spacing-2);
                        border-radius: 2px;
                    `;
                    
                    const legendText = document.createElement('span');
                    legendText.style = `
                        font-size: var(--font-size-sm);
                        color: var(--text);
                    `;
                    legendText.textContent = `سری ${i + 1}`;
                    
                    legendItem.appendChild(legendColor);
                    legendItem.appendChild(legendText);
                    legendElement.appendChild(legendItem);
                }
            }
            
            chartElement.appendChild(legendElement);
        }
        
        return chartElement;
    },
    
    /**
     * ایجاد یک نمودار دایره‌ای
     * 
     * @param {Object} options - تنظیمات نمودار
     * @returns {HTMLElement} - المنت نمودار
     */
    createPieChart(options = {}) {
        const {
            id = 'chart-' + Date.now(),
            title = '',
            data = [],
            labels = [],
            colors = ['#4361EE', '#3A0CA3', '#7209B7', '#F72585', '#7B2CBF', '#5A189A', '#3C096C', '#240046'],
            height = 300,
            width = '100%',
            showLegend = true,
            showValues = true,
            animation = true,
            formatter = value => value,
            donut = false,
            donutSize = 0.6
        } = options;
        
        // ایجاد المنت نمودار
        const chartElement = document.createElement('div');
        chartElement.className = 'chart-container';
        chartElement.id = id;
        chartElement.style = `
            width: ${typeof width === 'number' ? width + 'px' : width};
            height: ${typeof height === 'number' ? height + 'px' : height};
            position: relative;
            padding: var(--spacing-4);
            background: var(--glass-bg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--glass-border);
        `;
        
        // اضافه کردن عنوان
        if (title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'chart-title';
            titleElement.style = `
                font-size: var(--font-size-lg);
                font-weight: 600;
                margin-bottom: var(--spacing-4);
                text-align: center;
            `;
            titleElement.textContent = title;
            chartElement.appendChild(titleElement);
        }
        
        // ایجاد محتوای نمودار
        const chartContent = document.createElement('div');
        chartContent.className = 'chart-content';
        chartContent.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
            height: calc(100% - ${title ? '60px' : '20px'} - ${showLegend ? '60px' : '0px'});
            position: relative;
        `;
        
        // ایجاد SVG برای نمودار دایره‌ای
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '-1 -1 2 2');
        
        // محاسبه مجموع داده‌ها
        const total = data.reduce((sum, value) => sum + value, 0);
        
        // ایجاد بخش‌های دایره
        let startAngle = 0;
        data.forEach((value, index) => {
            if (value <= 0) return;
            
            const percentage = value / total;
            const endAngle = startAngle + (percentage * Math.PI * 2);
            
            // محاسبه نقاط مسیر
            const x1 = Math.cos(startAngle);
            const y1 = Math.sin(startAngle);
            const x2 = Math.cos(endAngle);
            const y2 = Math.sin(endAngle);
            
            // تعیین اگر قوس بزرگ است (بیش از 180 درجه)
            const largeArcFlag = percentage > 0.5 ? 1 : 0;
            
            // ایجاد مسیر قطعه
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            // مسیر برای دایره کامل
            let path;
            if (donut) {
                path = `
                    M ${x1 * donutSize} ${y1 * donutSize}
                    L ${x1} ${y1}
                    A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}
                    L ${x2 * donutSize} ${y2 * donutSize}
                    A ${donutSize} ${donutSize} 0 ${largeArcFlag} 0 ${x1 * donutSize} ${y1 * donutSize}
                    Z
                `;
            } else {
                path = `
                    M 0 0
                    L ${x1} ${y1}
                    A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                `;
            }
            
            pathElement.setAttribute('d', path);
            pathElement.setAttribute('fill', colors[index % colors.length]);
            
            // انیمیشن
            if (animation) {
                pathElement.style.opacity = '0';
                setTimeout(() => {
                    pathElement.style.transition = 'opacity 0.5s ease';
                    pathElement.style.opacity = '1';
                }, index * 150);
            }
            
            // اضافه کردن قطعه به SVG
            svg.appendChild(pathElement);
            
            // اضافه کردن مقدار درصد به قطعه
            if (showValues && percentage > 0.05) { // نمایش فقط برای قطعات بزرگ‌تر
                const labelAngle = startAngle + (percentage * Math.PI);
                const labelRadius = donut ? (1 + donutSize) / 2 : 0.7;
                const labelX = Math.cos(labelAngle) * labelRadius;
                const labelY = Math.sin(labelAngle) * labelRadius;
                
                const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textElement.setAttribute('x', labelX);
                textElement.setAttribute('y', labelY);
                textElement.setAttribute('text-anchor', 'middle');
                textElement.setAttribute('dominant-baseline', 'middle');
                textElement.setAttribute('fill', 'white');
                textElement.setAttribute('font-size', '0.15');
                textElement.textContent = `${Math.round(percentage * 100)}%`;
                
                // انیمیشن
                if (animation) {
                    textElement.style.opacity = '0';
                    setTimeout(() => {
                        textElement.style.transition = 'opacity 0.5s ease';
                        textElement.style.opacity = '1';
                    }, (index * 150) + 300);
                }
                
                svg.appendChild(textElement);
            }
            
            startAngle = endAngle;
        });
        
        chartContent.appendChild(svg);
        chartElement.appendChild(chartContent);
        
        // اضافه کردن راهنما
        if (showLegend) {
            const legendElement = document.createElement('div');
            legendElement.className = 'chart-legend';
            legendElement.style = `
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin-top: var(--spacing-4);
                gap: var(--spacing-3);
            `;
            
            data.forEach((value, index) => {
                if (value <= 0) return;
                
                const color = colors[index % colors.length];
                const percentage = (value / total) * 100;
                const label = labels[index] || `بخش ${index + 1}`;
                
                const legendItem = document.createElement('div');
                legendItem.className = 'chart-legend-item';
                legendItem.style = `
                    display: flex;
                    align-items: center;
                    margin-left: var(--spacing-3);
                `;
                
                const legendColor = document.createElement('div');
                legendColor.style = `
                    width: 12px;
                    height: 12px;
                    background: ${color};
                    margin-left: var(--spacing-2);
                    border-radius: 2px;
                `;
                
                const legendText = document.createElement('span');
                legendText.style = `
                    font-size: var(--font-size-sm);
                    color: var(--text);
                `;
                legendText.textContent = `${label} (${formatter(value)}, ${Math.round(percentage)}%)`;
                
                legendItem.appendChild(legendColor);
                legendItem.appendChild(legendText);
                
                // انیمیشن
                if (animation) {
                    legendItem.style.opacity = '0';
                    setTimeout(() => {
                        legendItem.style.transition = 'opacity 0.5s ease';
                        legendItem.style.opacity = '1';
                    }, (index * 150) + 500);
                }
                
                legendElement.appendChild(legendItem);
            });
            
            chartElement.appendChild(legendElement);
        }
        
        return chartElement;
    }
};
