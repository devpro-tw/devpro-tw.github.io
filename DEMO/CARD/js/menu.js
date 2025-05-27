// menu.js - 選單相關 JavaScript

// 頁面配置
const PAGES = {
    'transaction-records': {
        title: '刷卡紀錄查詢',
        url: 'pages/transaction-records.html',
        breadcrumb: ['首頁', '交易管理', '刷卡紀錄查詢']
    },
    'installment-system': {
        title: '分期作業',
        url: 'pages/installment-system.html',
        breadcrumb: ['首頁', '交易管理', '分期作業']
    }
};

// 當前頁面
let currentPage = null;

// 載入頁面
function loadPage(pageId) {
    const page = PAGES[pageId];
    if (!page) {
        Utils.showError('頁面不存在');
        return;
    }

    // 更新 breadcrumb
    updateBreadcrumb(page.breadcrumb);

    // 更新選單狀態
    updateMenuActive(pageId);

    // 載入內容
    const contentArea = document.getElementById('content-area');
    Utils.showLoading(contentArea);

    // 建立或取得 iframe
    let iframe = document.getElementById('content-frame');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'content-frame';
        contentArea.innerHTML = ''; // 清空原有內容
        contentArea.appendChild(iframe);
    }

    // 載入頁面
    iframe.onload = () => {
        Utils.hideLoading(contentArea);
        currentPage = pageId;
    };
    iframe.src = page.url;
}

// 更新 breadcrumb
function updateBreadcrumb(items) {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = items.map(item => `<span>${item}</span>`).join('');
}

// 更新選單 active 狀態
function updateMenuActive(pageId) {
    // 移除所有 active
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // 添加新的 active
    const menuLinks = document.querySelectorAll('.menu-item a');
    menuLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
            link.parentElement.classList.add('active');
        }
    });
}

// 刷卡紀錄查詢頁面功能
const TransactionRecords = {
    init: function() {
        // 初始化 Grid
        GridUtils.initGrid('oaaaGrid', {
            onRowDblClick: function(row) {
                const id = row.cells[1].textContent;
                alert(`查看交易明細: ${id}`);
            }
        });
    },

    queryOAAA: function() {
        alert('執行 OAAA 查詢...');
        this.loadOAAAData();
    },

    querySPDH: function() {
        alert('執行 SPDH 卡號查詢...');
    },

    querySPDH2: function() {
        alert('執行 SPDH 查詢...');
    },

    loadOAAAData: function() {
        GridUtils.clearGrid('oaaaGrid');
        
        const sampleData = [
            ['N', '5234567890123456', '2024/01/15', '14:32:15', '1,500', 'AUTH', '5411', 'TW', '523456', 'APPROVED', '', 'Y'],
            ['Y', '5234567890123457', '2024/01/15', '15:45:20', '3,200', 'AUTH CVV', '5812', 'TW', '523457', 'DECLINED', '051', 'N']
        ];
        
        sampleData.forEach(row => {
            GridUtils.addRow('oaaaGrid', row);
        });
    }
};

// 分期作業頁面功能
const InstallmentSystem = {
    init: function() {
        // 初始化所有 Grid
        for (let i = 1; i <= 3; i++) {
            GridUtils.initGrid(`grid${i}`, {
                onRowDblClick: function(row) {
                    const id = row.cells[1].textContent;
                    alert(`查看交易明細: ${id}`);
                }
            });
        }
        
        // 載入範例資料
        this.loadSampleData();
    },

    switchTab: function(index) {
        // 切換 Tab
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.style.backgroundColor = 'white';
                tab.style.borderTop = '2px solid #4285f4';
                tab.style.fontWeight = 'bold';
                contents[i].style.display = 'block';
            } else {
                tab.style.backgroundColor = '#f5f5f5';
                tab.style.borderTop = 'none';
                tab.style.fontWeight = 'normal';
                contents[i].style.display = 'none';
            }
        });
    },

    calculate: function(gridNumber) {
        const selected = GridUtils.getSelectedRows(`grid${gridNumber}`);
        if (selected.length === 0) {
            alert('請先選擇要試算的交易項目');
            return;
        }
        alert(`執行試算 Grid ${gridNumber}...`);
    },

    applySingleInstallment: function() {
        const selected = GridUtils.getSelectedRows('grid1');
        if (selected.length !== 1) {
            alert('請選擇一筆交易進行單筆分期');
            return;
        }
        alert('執行單筆分期申請...');
    },

    applyInstallment: function() {
        const allSelected = [];
        for (let i = 1; i <= 3; i++) {
            allSelected.push(...GridUtils.getSelectedRows(`grid${i}`));
        }
        
        if (allSelected.length === 0) {
            alert('請選擇要申請分期的交易項目');
            return;
        }
        
        alert(`申請分期: 共 ${allSelected.length} 筆交易`);
    },

    reselect: function() {
        if (confirm('確定要清除所有選擇嗎？')) {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            document.querySelectorAll('select').forEach(sel => {
                sel.value = '';
            });
        }
    },

    loadSampleData: function() {
        // Grid1 範例資料
        GridUtils.addRow('grid1', [
            {type: 'checkbox'},
            'A123456789',
            {type: 'select', options: [
                {value: '', text: '請選擇'},
                {value: '3', text: '3期'},
                {value: '6', text: '6期'},
                {value: '12', text: '12期'},
                {value: '24', text: '24期'}
            ]},
            '5234****1234',
            'VISA',
            '15,000',
            '2024/01/15',
            '14:32:15',
            '15,000',
            '123456',
            '5411',
            'M12345678'
        ]);
    }
};

// 添加寬度調整功能
document.addEventListener('DOMContentLoaded', function() {
    const resizer = document.getElementById('dragMe');
    const sidebar = document.querySelector('.sidebar');
    
    let isResizing = false;
    let lastDownX = 0;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastDownX = e.clientX;
        document.body.style.cursor = 'col-resize';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const delta = e.clientX - lastDownX;
        const newWidth = sidebar.offsetWidth + delta;
        
        if (newWidth >= 150 && newWidth <= 500) {
            sidebar.style.width = `${newWidth}px`;
            sidebar.style.flexBasis = `${newWidth}px`;
            lastDownX = e.clientX;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = 'default';
    });
});