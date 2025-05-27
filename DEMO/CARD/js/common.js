// common.js - 共用 JavaScript 函數

// 全域設定
const CONFIG = {
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm:ss',
    currency: 'TWD',
    locale: 'zh-TW'
};

// 工具函數
const Utils = {
    // 格式化日期
    formatDate: function(date) {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    },

    // 格式化時間
    formatTime: function(date) {
        if (!date) return '';
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    // 格式化金額
    formatCurrency: function(amount) {
        if (isNaN(amount)) return '0';
        return new Intl.NumberFormat('zh-TW').format(amount);
    },

    // 顯示載入中
    showLoading: function(element) {
        element.innerHTML = '<div class="loading"></div> 載入中...';
    },

    // 顯示錯誤訊息
    showError: function(message) {
        alert('錯誤: ' + message);
    },

    // 顯示成功訊息
    showSuccess: function(message) {
        alert('成功: ' + message);
    },

    // 確認對話框
    confirm: function(message) {
        return confirm(message);
    },

    // Ajax 請求封裝
    ajax: function(options) {
        return fetch(options.url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.data ? JSON.stringify(options.data) : null
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    }
};

// Grid 相關函數
const GridUtils = {
    // 初始化 Grid
    initGrid: function(gridId, options) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        // 添加事件監聽
        grid.addEventListener('click', function(e) {
            // Checkbox 點擊
            if (e.target.type === 'checkbox') {
                const row = e.target.closest('tr');
                if (row) {
                    row.classList.toggle('selected', e.target.checked);
                }
            }
        });

        // 雙擊事件
        grid.addEventListener('dblclick', function(e) {
            if (e.target.tagName === 'TD' && e.target.cellIndex > 0) {
                if (options.onRowDblClick) {
                    const row = e.target.parentElement;
                    options.onRowDblClick(row);
                }
            }
        });
    },

    // 取得選中的行
    getSelectedRows: function(gridId) {
        const grid = document.getElementById(gridId);
        const rows = grid.querySelectorAll('tbody tr');
        const selected = [];

        rows.forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                selected.push({
                    index: index,
                    row: row,
                    data: this.getRowData(row)
                });
            }
        });

        return selected;
    },

    // 取得行資料
    getRowData: function(row) {
        const data = {};
        const cells = row.cells;
        
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const input = cell.querySelector('input, select');
            
            if (input) {
                if (input.type === 'checkbox') {
                    data[`col${i}`] = input.checked;
                } else {
                    data[`col${i}`] = input.value;
                }
            } else {
                data[`col${i}`] = cell.textContent.trim();
            }
        }
        
        return data;
    },

    // 清空 Grid
    clearGrid: function(gridId) {
        const grid = document.getElementById(gridId);
        const tbody = grid.querySelector('tbody');
        tbody.innerHTML = '';
    },

    // 添加行
    addRow: function(gridId, rowData) {
        const grid = document.getElementById(gridId);
        const tbody = grid.querySelector('tbody');
        const tr = document.createElement('tr');
        
        rowData.forEach(cellData => {
            const td = document.createElement('td');
            if (typeof cellData === 'object' && cellData.type) {
                // 特殊元素
                if (cellData.type === 'checkbox') {
                    td.innerHTML = '<input type="checkbox" />';
                } else if (cellData.type === 'select') {
                    const select = document.createElement('select');
                    cellData.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        select.appendChild(option);
                    });
                    td.appendChild(select);
                }
            } else {
                td.textContent = cellData;
            }
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    }
};

// Form 相關函數
const FormUtils = {
    // 序列化表單
    serialize: function(formId) {
        const form = document.getElementById(formId);
        const data = {};
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    data[input.name] = input.checked;
                } else if (input.type === 'radio') {
                    if (input.checked) {
                        data[input.name] = input.value;
                    }
                } else {
                    data[input.name] = input.value;
                }
            }
        });
        
        return data;
    },

    // 填充表單
    populate: function(formId, data) {
        const form = document.getElementById(formId);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = data[key];
                } else if (input.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = data[key];
                }
            }
        });
    },

    // 清空表單
    clear: function(formId) {
        const form = document.getElementById(formId);
        form.reset();
    },

    // 驗證表單
    validate: function(formId, rules) {
        const form = document.getElementById(formId);
        const errors = [];
        
        Object.keys(rules).forEach(fieldName => {
            const input = form.querySelector(`[name="${fieldName}"]`);
            const rule = rules[fieldName];
            
            if (input) {
                const value = input.value.trim();
                
                if (rule.required && !value) {
                    errors.push(`${rule.label || fieldName} 為必填欄位`);
                }
                
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`${rule.label || fieldName} 長度至少需要 ${rule.minLength} 個字元`);
                }
                
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push(`${rule.label || fieldName} 格式不正確`);
                }
            }
        });
        
        return errors;
    }
};

// 初始化共用功能
document.addEventListener('DOMContentLoaded', function() {
    // 更新時間顯示
    const updateDateTime = function() {
        const now = new Date();
        const dateTimeElement = document.getElementById('datetime');
        if (dateTimeElement) {
            dateTimeElement.textContent = Utils.formatDate(now) + ' ' + Utils.formatTime(now);
        }
    };
    
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 顯示瀏覽器資訊
    const browserInfo = document.getElementById('browser-info');
    if (browserInfo) {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.indexOf('Chrome') > -1) {
            browser = 'Chrome';
        } else if (userAgent.indexOf('Safari') > -1) {
            browser = 'Safari';
        } else if (userAgent.indexOf('Firefox') > -1) {
            browser = 'Firefox';
        } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
            browser = 'Internet Explorer';
        }
        
        browserInfo.textContent = browser;
    }
});

// 匯出給全域使用
window.Utils = Utils;
window.GridUtils = GridUtils;
window.FormUtils = FormUtils;