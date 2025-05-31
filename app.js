document.addEventListener('DOMContentLoaded', () => {
    const APP_DATA_KEY = 'snackBarPOSData';

    // DOM Elements
    const establishmentNameDisplay = document.getElementById('establishmentNameDisplay');
    const establishmentNameInput = document.getElementById('establishmentNameInput');
    const nextOrderNumberInput = document.getElementById('nextOrderNumberInput');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const resetAllDataBtn = document.getElementById('resetAllDataBtn');

    const categoryForm = document.getElementById('categoryForm');
    const categoryIdInput = document.getElementById('categoryId');
    const categoryNameInput = document.getElementById('categoryName');
    const categoryListTableBody = document.getElementById('categoryListTableBody');
    const productCategorySelect = document.getElementById('productCategory');
    const posCategoryFilter = document.getElementById('posCategoryFilter');
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));

    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productListTableBody = document.getElementById('productListTableBody');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));

    const posProductList = document.getElementById('posProductList');
    const posProductSearch = document.getElementById('posProductSearch');
    const currentOrderItems = document.getElementById('currentOrderItems');
    const currentOrderTotalDisplay = document.getElementById('currentOrderTotal');
    const currentOrderNumberDisplay = document.getElementById('currentOrderNumberDisplay');
    const editOrderNumberBtn = document.getElementById('editOrderNumberBtn');
    
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const customerObservationsInput = document.getElementById('customerObservations');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const finalizeOrderBtn = document.getElementById('finalizeOrderBtn');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');

    const salesReportTableBody = document.getElementById('salesReportTableBody');
    const printSalesReportBtn = document.getElementById('printSalesReportBtn');
    const reportDateFilter = document.getElementById('reportDateFilter');
    const filterReportBtn = document.getElementById('filterReportBtn');
    const clearReportFilterBtn = document.getElementById('clearReportFilterBtn');
    const reportTotalOrders = document.getElementById('reportTotalOrders');
    const reportTotalRevenue = document.getElementById('reportTotalRevenue');
    const reportTitle = document.getElementById('reportTitle');

    const receiptPreviewModalEl = document.getElementById('receiptPreviewModal');
    const receiptPreviewModal = new bootstrap.Modal(receiptPreviewModalEl);
    const receiptContentArea = document.getElementById('receiptContentArea');
    const printActualReceiptBtn = document.getElementById('printActualReceiptBtn');

    const confirmModalEl = document.getElementById('confirmModal');
    const confirmModal = new bootstrap.Modal(confirmModalEl);
    const confirmModalBody = document.getElementById('confirmModalBody');
    const confirmModalConfirmBtn = document.getElementById('confirmModalConfirmBtn');
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataFile = document.getElementById('importDataFile');

    // Cash Management Elements
    const openCashRegisterBtn = document.getElementById('openCashRegisterBtn');
    const closeCashRegisterBtn = document.getElementById('closeCashRegisterBtn');
    const cashRegisterStatusDisplay = document.getElementById('cashRegisterStatus');
    const cashOpenTimeDisplay = document.getElementById('cashOpenTime');
    const cashOpenInitialAmountDisplay = document.getElementById('cashOpenInitialAmountDisplay');
    const cashSessionReportDiv = document.getElementById('cashSessionReport');
    const sessionOpenTime = document.getElementById('sessionOpenTime');
    const sessionCloseTime = document.getElementById('sessionCloseTime');
    const sessionInitialAmount = document.getElementById('sessionInitialAmount');
    const sessionSalesCash = document.getElementById('sessionSalesCash');
    const sessionSalesCard = document.getElementById('sessionSalesCard');
    const sessionSalesPix = document.getElementById('sessionSalesPix');
    const sessionTotalSales = document.getElementById('sessionTotalSales');
    const sessionExpectedInCash = document.getElementById('sessionExpectedInCash');
    const printCashSessionReportBtn = document.getElementById('printCashSessionReportBtn');
    const openCashModal = new bootstrap.Modal(document.getElementById('openCashModal'));
    const openCashForm = document.getElementById('openCashForm');
    const initialCashAmountInput = document.getElementById('initialCashAmount');


    let appData = {
        settings: {
            establishmentName: 'Lanchonete Legal',
            nextOrderId: 1,
            nextOrderNumberEditable: true
        },
        categories: [],
        products: [],
        orders: [],
        cashRegister: {
            isOpen: false,
            openTime: null,
            closeTime: null,
            initialAmount: 0,
            currentSessionOrders: []
        }
    };

    let currentOrder = {
        items: [],
        total: 0,
        orderNumber: 1
    };
    
    let editingItemId = null;

    // --- Utility Functions ---
    function saveData() {
        localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
    }

    function loadData() {
        const data = localStorage.getItem(APP_DATA_KEY);
        if (data) {
            appData = JSON.parse(data);
            appData.settings = appData.settings || { establishmentName: 'Lanchonete Legal', nextOrderId: 1, nextOrderNumberEditable: true };
            appData.categories = appData.categories || [];
            appData.products = appData.products || [];
            appData.orders = appData.orders || [];
            appData.cashRegister = appData.cashRegister || { isOpen: false, openTime: null, closeTime: null, initialAmount: 0, currentSessionOrders: [] };
            if (typeof appData.settings.nextOrderNumberEditable === 'undefined') {
                appData.settings.nextOrderNumberEditable = true;
            }
        }
        currentOrder.orderNumber = appData.settings.nextOrderId;
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function formatCurrency(value) {
        return parseFloat(value).toFixed(2).replace('.', ',');
    }

    function showConfirmModal(message, onConfirm) {
        confirmModalBody.textContent = message;
        confirmModalConfirmBtn.onclick = () => {
            onConfirm();
            confirmModal.hide();
        };
        confirmModal.show();
    }

    // --- Settings ---
    function loadSettings() {
        establishmentNameDisplay.textContent = appData.settings.establishmentName;
        establishmentNameInput.value = appData.settings.establishmentName;
        nextOrderNumberInput.value = appData.settings.nextOrderId;
        currentOrderNumberDisplay.textContent = appData.settings.nextOrderId;
        currentOrder.orderNumber = appData.settings.nextOrderId;
    }

    saveSettingsBtn.addEventListener('click', () => {
        appData.settings.establishmentName = establishmentNameInput.value.trim() || 'Lanchonete';
        const nextOrder = parseInt(nextOrderNumberInput.value);
        if (!isNaN(nextOrder) && nextOrder > 0) {
            appData.settings.nextOrderId = nextOrder;
             if (currentOrder.items.length === 0) {
                currentOrder.orderNumber = nextOrder;
                currentOrderNumberDisplay.textContent = nextOrder;
            }
        }
        saveData();
        loadSettings();
        alert('Configurações salvas!');
    });

    resetAllDataBtn.addEventListener('click', () => {
        showConfirmModal('Tem certeza que deseja APAGAR TODOS OS DADOS? Esta ação não pode ser desfeita.', () => {
            localStorage.removeItem(APP_DATA_KEY);
            appData = {
                settings: { establishmentName: 'Lanchonete Legal', nextOrderId: 1, nextOrderNumberEditable: true },
                categories: [],
                products: [],
                orders: [],
                cashRegister: { isOpen: false, openTime: null, closeTime: null, initialAmount: 0, currentSessionOrders: [] }
            };
            currentOrder = { items: [], total: 0, orderNumber: appData.settings.nextOrderId };
            saveData();
            loadInitialData();
            alert('Todos os dados foram resetados.');
        });
    });

    exportDataBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(appData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `lanchonete_backup_${new Date().toISOString().slice(0,10)}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    importDataFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (importedData.settings && importedData.categories && importedData.products && importedData.orders) {
                         showConfirmModal('Importar este arquivo substituirá todos os dados atuais. Deseja continuar?', () => {
                            appData = importedData;
                            appData.cashRegister = appData.cashRegister || { isOpen: false, openTime: null, closeTime: null, initialAmount: 0, currentSessionOrders: [] };
                            if (typeof appData.settings.nextOrderNumberEditable === 'undefined') {
                                appData.settings.nextOrderNumberEditable = true;
                            }
                            saveData();
                            loadInitialData();
                            alert('Dados importados com sucesso!');
                        });
                    } else {
                        alert('Arquivo JSON inválido ou não contém a estrutura esperada.');
                    }
                } catch (error) {
                    alert('Erro ao ler o arquivo JSON: ' + error.message);
                } finally {
                     importDataFile.value = '';
                }
            };
            reader.readAsText(file);
        }
    });

    // --- Categories ---
    function renderCategories() {
        categoryListTableBody.innerHTML = '';
        productCategorySelect.innerHTML = '<option value="">Selecione uma Categoria</option>';
        posCategoryFilter.innerHTML = '<option value="">Todas as Categorias</option>';

        appData.categories.forEach(cat => {
            const row = categoryListTableBody.insertRow();
            row.innerHTML = `
                <td>${cat.name}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-cat-btn" data-id="${cat.id}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-cat-btn" data-id="${cat.id}"><i class="bi bi-trash"></i> Excluir</button>
                </td>
            `;
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            productCategorySelect.appendChild(option.cloneNode(true));
            posCategoryFilter.appendChild(option);
        });
    }

    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = categoryNameInput.value.trim();
        if (!name) return;

        if (editingItemId) {
            const category = appData.categories.find(cat => cat.id === editingItemId);
            if (category) category.name = name;
        } else {
            appData.categories.push({ id: generateId(), name });
        }
        
        saveData();
        renderCategories();
        renderPosProducts();
        categoryForm.reset();
        editingItemId = null;
        categoryModal.hide();
    });

    categoryListTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.edit-cat-btn')) {
            editingItemId = e.target.closest('.edit-cat-btn').dataset.id;
            const category = appData.categories.find(cat => cat.id === editingItemId);
            if (category) {
                categoryNameInput.value = category.name;
                categoryIdInput.value = category.id;
                document.getElementById('categoryModalLabel').textContent = 'Editar Categoria';
                categoryModal.show();
            }
        }
        if (e.target.closest('.delete-cat-btn')) {
            const catId = e.target.closest('.delete-cat-btn').dataset.id;
            const isUsed = appData.products.some(p => p.categoryId === catId);
            if (isUsed) {
                alert('Esta categoria está sendo usada por produtos e não pode ser excluída.');
                return;
            }
            showConfirmModal('Tem certeza que deseja excluir esta categoria?', () => {
                appData.categories = appData.categories.filter(cat => cat.id !== catId);
                saveData();
                renderCategories();
                renderPosProducts();
            });
        }
    });
    
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        editingItemId = null;
        categoryForm.reset();
        document.getElementById('categoryModalLabel').textContent = 'Adicionar Categoria';
    });

    // --- Products ---
    function renderProducts() {
        productListTableBody.innerHTML = '';
        appData.products.forEach(prod => {
            const category = appData.categories.find(cat => cat.id === prod.categoryId);
            const row = productListTableBody.insertRow();
            row.innerHTML = `
                <td>${prod.name}</td>
                <td>R$ ${formatCurrency(prod.price)}</td>
                <td>${category ? category.name : 'Sem Categoria'}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-prod-btn" data-id="${prod.id}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-prod-btn" data-id="${prod.id}"><i class="bi bi-trash"></i> Excluir</button>
                </td>
            `;
        });
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = productNameInput.value.trim();
        const price = parseFloat(productPriceInput.value);
        const categoryId = productCategorySelect.value;

        if (!name || isNaN(price) || price <= 0 || !categoryId) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        if (editingItemId) {
            const product = appData.products.find(p => p.id === editingItemId);
            if (product) {
                product.name = name;
                product.price = price;
                product.categoryId = categoryId;
            }
        } else {
            appData.products.push({ id: generateId(), name, price, categoryId });
        }
        
        saveData();
        renderProducts();
        renderPosProducts();
        productForm.reset();
        editingItemId = null;
        productModal.hide();
    });

    productListTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.edit-prod-btn')) {
            editingItemId = e.target.closest('.edit-prod-btn').dataset.id;
            const product = appData.products.find(p => p.id === editingItemId);
            if (product) {
                productNameInput.value = product.name;
                productPriceInput.value = product.price;
                productCategorySelect.value = product.categoryId;
                productIdInput.value = product.id;
                document.getElementById('productModalLabel').textContent = 'Editar Produto';
                productModal.show();
            }
        }
        if (e.target.closest('.delete-prod-btn')) {
            const prodId = e.target.closest('.delete-prod-btn').dataset.id;
             showConfirmModal('Tem certeza que deseja excluir este produto?', () => {
                appData.products = appData.products.filter(p => p.id !== prodId);
                saveData();
                renderProducts();
                renderPosProducts();
            });
        }
    });

    document.getElementById('addProductBtn').addEventListener('click', () => {
        editingItemId = null;
        productForm.reset();
        document.getElementById('productModalLabel').textContent = 'Adicionar Produto';
    });

    // --- POS (Point of Sale) ---
    function renderPosProducts(searchTerm = '', categoryFilter = '') {
        posProductList.innerHTML = '';
        let filteredProducts = appData.products;

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.categoryId === categoryFilter);
        }
        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        if (filteredProducts.length === 0) {
            posProductList.innerHTML = '<p class="text-muted p-3">Nenhum produto encontrado.</p>';
            return;
        }

        filteredProducts.forEach(prod => {
            const category = appData.categories.find(cat => cat.id === prod.categoryId);
            const item = document.createElement('button');
            item.type = 'button';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.dataset.id = prod.id;
            item.innerHTML = `
                <strong>${prod.name}</strong> - R$ ${formatCurrency(prod.price)}
                <small class="d-block text-muted">${category ? category.name : 'Sem categoria'}</small>
            `;
            item.addEventListener('click', () => addProductToOrder(prod.id));
            posProductList.appendChild(item);
        });
    }
    
    posCategoryFilter.addEventListener('change', () => renderPosProducts(posProductSearch.value.trim(), posCategoryFilter.value));
    posProductSearch.addEventListener('input', () => renderPosProducts(posProductSearch.value.trim(), posCategoryFilter.value));

    function addProductToOrder(productId) {
        const product = appData.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = currentOrder.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentOrder.items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        updateCurrentOrderDisplay();
    }

    function updateCurrentOrderDisplay() {
        currentOrderItems.innerHTML = '';
        currentOrder.total = 0;

        if (currentOrder.items.length === 0) {
            currentOrderItems.innerHTML = '<p class="text-muted">Nenhum item no pedido.</p>';
            currentOrderTotalDisplay.textContent = '0,00';
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush');

        currentOrder.items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            const itemTotal = item.price * item.quantity;
            currentOrder.total += itemTotal;
            
            li.innerHTML = `
                <div>
                    ${item.name} (R$ ${formatCurrency(item.price)}) x ${item.quantity}
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-3 fw-bold">R$ ${formatCurrency(itemTotal)}</span>
                    <div class="item-controls btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary decrease-qty-btn" data-id="${item.productId}">-</button>
                        <button class="btn btn-outline-secondary increase-qty-btn" data-id="${item.productId}">+</button>
                        <button class="btn btn-outline-danger remove-item-btn" data-id="${item.productId}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
            ul.appendChild(li);
        });
        currentOrderItems.appendChild(ul);
        currentOrderTotalDisplay.textContent = formatCurrency(currentOrder.total);
    }

    currentOrderItems.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const productId = target.dataset.id;
        const itemIndex = currentOrder.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) return;

        if (target.classList.contains('increase-qty-btn')) {
            currentOrder.items[itemIndex].quantity++;
        } else if (target.classList.contains('decrease-qty-btn')) {
            currentOrder.items[itemIndex].quantity--;
            if (currentOrder.items[itemIndex].quantity <= 0) {
                currentOrder.items.splice(itemIndex, 1);
            }
        } else if (target.classList.contains('remove-item-btn')) {
            currentOrder.items.splice(itemIndex, 1);
        }
        updateCurrentOrderDisplay();
    });
    
    editOrderNumberBtn.addEventListener('click', () => {
        if (!appData.settings.nextOrderNumberEditable) {
            alert("A edição do número do pedido está desativada nas configurações.");
            return;
        }
        const newOrderNumberStr = prompt("Digite o novo número para este pedido:", currentOrder.orderNumber);
        if (newOrderNumberStr !== null) {
            const newOrderNumber = parseInt(newOrderNumberStr);
            if (!isNaN(newOrderNumber) && newOrderNumber > 0) {
                currentOrder.orderNumber = newOrderNumber;
                currentOrderNumberDisplay.textContent = newOrderNumber;
                 if (newOrderNumber >= appData.settings.nextOrderId) {
                    appData.settings.nextOrderId = newOrderNumber + 1;
                    saveData();
                    nextOrderNumberInput.value = appData.settings.nextOrderId;
                }
            } else {
                alert("Número do pedido inválido.");
            }
        }
    });


    finalizeOrderBtn.addEventListener('click', () => {
        if (currentOrder.items.length === 0) {
            alert('Adicione itens ao pedido antes de finalizar.');
            return;
        }
        if (!appData.cashRegister.isOpen) {
            alert('O caixa está fechado. Por favor, abra o caixa antes de registrar vendas.');
            return;
        }

        const order = {
            id: generateId(),
            orderNumber: currentOrder.orderNumber,
            customerName: customerNameInput.value.trim(),
            customerPhone: customerPhoneInput.value.trim(),
            observations: customerObservationsInput.value.trim(),
            items: JSON.parse(JSON.stringify(currentOrder.items)),
            total: currentOrder.total,
            paymentMethod: paymentMethodSelect.value,
            timestamp: new Date().toISOString()
        };

        appData.orders.push(order);
        appData.cashRegister.currentSessionOrders.push(order.id);

        if (order.orderNumber >= appData.settings.nextOrderId) {
            appData.settings.nextOrderId = order.orderNumber + 1;
        }
        
        saveData();
        generateReceipt(order);
        resetCurrentOrder();
        renderSalesReports();
        updateCashManagementUI();
        alert(`Pedido #${order.orderNumber} finalizado!`);
    });

    cancelOrderBtn.addEventListener('click', () => {
        if (currentOrder.items.length > 0) {
            showConfirmModal('Tem certeza que deseja cancelar o pedido atual e limpar todos os itens?', () => {
                resetCurrentOrder(false);
            });
        } else {
            resetCurrentOrder(false);
        }
    });

    function resetCurrentOrder(advanceOrderNumber = true) {
        currentOrder.items = [];
        currentOrder.total = 0;
        if (advanceOrderNumber) {
            currentOrder.orderNumber = appData.settings.nextOrderId;
        }
        
        customerNameInput.value = '';
        customerPhoneInput.value = '';
        customerObservationsInput.value = '';
        paymentMethodSelect.value = 'dinheiro';
        updateCurrentOrderDisplay();
        currentOrderNumberDisplay.textContent = currentOrder.orderNumber;
    }

    function generateReceipt(order) {
        const establishment = appData.settings.establishmentName;
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${item.quantity}x ${item.name}</td>
                    <td>R$ ${formatCurrency(item.price * item.quantity)}</td>
                </tr>
            `;
        });

        const receiptHtml = `
            <div id="receiptToPrint">
                <h5>${establishment}</h5>
                <h6>Pedido #${order.orderNumber}</h6>
                <p>Data: ${new Date(order.timestamp).toLocaleString('pt-BR')}</p>
                ${order.customerName ? `<p>Cliente: ${order.customerName}</p>` : ''}
                ${order.customerPhone ? `<p>Telefone: ${order.customerPhone}</p>` : ''}
                <hr>
                <table>
                    <thead><tr><th>Item</th><th>Subtotal</th></tr></thead>
                    <tbody>${itemsHtml}</tbody>
                </table>
                <hr>
                <p class="receipt-total">Total: R$ ${formatCurrency(order.total)}</p>
                <p>Pagamento: ${getPaymentMethodName(order.paymentMethod)}</p>
                ${order.observations ? `<p>Obs: ${order.observations}</p>` : ''}
                <p class="timestamp text-center">Obrigado pela preferência!</p>
            </div>
        `;
        receiptContentArea.innerHTML = receiptHtml;
        receiptPreviewModal.show();
    }
    
    function getPaymentMethodName(methodKey) {
        const names = {
            'dinheiro': 'Dinheiro',
            'cartao_credito': 'Cartão de Crédito',
            'cartao_debito': 'Cartão de Débito',
            'pix': 'PIX'
        };
        return names[methodKey] || methodKey;
    }

    printActualReceiptBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Recibo #${appData.settings.nextOrderId - 1}</title>
                <style>
                    body { width: 300px; margin: 0 auto; font-family: 'Courier New', monospace; font-size: 12px; }
                    h5, h6 { text-align: center; margin: 5px 0; }
                    hr { border-top: 1px dashed #000; }
                    table { width: 100%; border-collapse: collapse; }
                    td { padding: 2px 0; }
                    .receipt-total { font-weight: bold; margin-top: 5px; }
                    .timestamp { text-align: center; margin-top: 10px; }
                </style>
            </head>
            <body>
                ${receiptContentArea.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

    // --- Reports ---
    function renderSalesReports(filterDate = null) {
        salesReportTableBody.innerHTML = '';
        let filteredOrders = appData.orders;
        let currentReportTitle = `Relatório de Vendas - Todos os Pedidos`;

        if (filterDate) {
            filteredOrders = appData.orders.filter(order => {
                return order.timestamp.startsWith(filterDate);
            });
            currentReportTitle = `Relatório de Vendas - ${new Date(filterDate + 'T00:00:00').toLocaleDateString('pt-BR')}`;
        }
        reportTitle.textContent = currentReportTitle;

        let totalRevenue = 0;
        let totalOrdersCount = 0;

        if (filteredOrders.length === 0) {
            salesReportTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum pedido encontrado.</td></tr>';
        }

        filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(order => {
            const row = salesReportTableBody.insertRow();
            let itemsSummary = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
            if(itemsSummary.length > 50) itemsSummary = itemsSummary.substring(0, 47) + '...';

            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${new Date(order.timestamp).toLocaleString('pt-BR')}</td>
                <td>${order.customerName || '-'}</td>
                <td>${itemsSummary}</td>
                <td>R$ ${formatCurrency(order.total)}</td>
                <td>${getPaymentMethodName(order.paymentMethod)}</td>
            `;
            totalRevenue += order.total;
            totalOrdersCount++;
        });

        reportTotalOrders.textContent = totalOrdersCount;
        reportTotalRevenue.textContent = formatCurrency(totalRevenue);
    }
    
    filterReportBtn.addEventListener('click', () => {
        renderSalesReports(reportDateFilter.value);
    });
    clearReportFilterBtn.addEventListener('click', () => {
        reportDateFilter.value = '';
        renderSalesReports();
    });

    printSalesReportBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Vendas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; font-size: 12px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #dee2e6; padding: 5px; }
                    th { background-color: #f8f9fa; }
                    h3 { margin-top: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>${reportTitle.textContent}</h3>
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Data/Hora</th>
                                <th>Cliente</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${salesReportTableBody.innerHTML}
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-between mt-3">
                        <strong>Total Pedidos: ${reportTotalOrders.textContent}</strong>
                        <strong>Receita Total: R$ ${reportTotalRevenue.textContent}</strong>
                    </div>
                    <p class="text-end mt-4">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

    // --- Cash Management ---
    function updateCashManagementUI() {
        const cash = appData.cashRegister;
        if (cash.isOpen) {
            cashRegisterStatusDisplay.textContent = 'Aberto';
            cashRegisterStatusDisplay.classList.remove('text-danger');
            cashRegisterStatusDisplay.classList.add('text-success');
            cashOpenTimeDisplay.textContent = `Aberto em: ${new Date(cash.openTime).toLocaleString('pt-BR')}`;
            cashOpenInitialAmountDisplay.textContent = formatCurrency(cash.initialAmount);
            openCashRegisterBtn.disabled = true;
            closeCashRegisterBtn.disabled = false;
            cashSessionReportDiv.style.display = 'block';
            calculateCurrentSessionReport();
        } else {
            cashRegisterStatusDisplay.textContent = 'Fechado';
            cashRegisterStatusDisplay.classList.remove('text-success');
            cashRegisterStatusDisplay.classList.add('text-danger');
            cashOpenTimeDisplay.textContent = `Aberto em: N/A`;
            cashOpenInitialAmountDisplay.textContent = `0,00`;
            openCashRegisterBtn.disabled = false;
            closeCashRegisterBtn.disabled = true;
            
            if(cash.closeTime) {
                cashSessionReportDiv.style.display = 'block';
                calculateCurrentSessionReport(true);
            } else {
                 cashSessionReportDiv.style.display = 'none';
            }
        }
    }

    openCashRegisterBtn.addEventListener('click', () => {
        if (appData.cashRegister.isOpen) {
            alert('O caixa já está aberto.');
            return;
        }
        initialCashAmountInput.value = '0.00';
        openCashModal.show();
    });

    openCashForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const initialAmount = parseFloat(initialCashAmountInput.value);
        if (isNaN(initialAmount) || initialAmount < 0) {
            alert('Valor inicial inválido.');
            return;
        }
        appData.cashRegister.isOpen = true;
        appData.cashRegister.openTime = new Date().toISOString();
        appData.cashRegister.closeTime = null;
        appData.cashRegister.initialAmount = initialAmount;
        appData.cashRegister.currentSessionOrders = [];
        saveData();
        updateCashManagementUI();
        openCashModal.hide();
        alert('Caixa aberto com sucesso!');
    });

    closeCashRegisterBtn.addEventListener('click', () => {
        if (!appData.cashRegister.isOpen) {
            alert('O caixa já está fechado.');
            return;
        }
        showConfirmModal('Tem certeza que deseja fechar o caixa? Isso finalizará a sessão atual.', () => {
            appData.cashRegister.isOpen = false;
            appData.cashRegister.closeTime = new Date().toISOString();
            saveData();
            updateCashManagementUI();
            alert('Caixa fechado com sucesso!');
        });
    });
    
    function calculateCurrentSessionReport(isLastClosedSession = false) {
        const cash = appData.cashRegister;
        let sessionOrders = [];
        
        if (isLastClosedSession && cash.closeTime) {
            sessionOpenTime.textContent = new Date(cash.openTime).toLocaleString('pt-BR');
            sessionCloseTime.textContent = new Date(cash.closeTime).toLocaleString('pt-BR');
             sessionOrders = appData.orders.filter(order => {
                const orderTime = new Date(order.timestamp);
                return orderTime >= new Date(cash.openTime) && orderTime <= new Date(cash.closeTime) && cash.currentSessionOrders.includes(order.id);
            });

        } else if (cash.isOpen) {
            sessionOpenTime.textContent = new Date(cash.openTime).toLocaleString('pt-BR');
            sessionCloseTime.textContent = 'Em andamento';
            sessionOrders = appData.orders.filter(order => {
                const orderTime = new Date(order.timestamp);
                return orderTime >= new Date(cash.openTime) && cash.currentSessionOrders.includes(order.id);
            });
        } else {
            cashSessionReportDiv.style.display = 'none';
            return;
        }

        let salesCash = 0, salesCard = 0, salesPix = 0, totalSessionSales = 0;

        sessionOrders.forEach(order => {
            totalSessionSales += order.total;
            switch (order.paymentMethod) {
                case 'dinheiro': salesCash += order.total; break;
                case 'cartao_credito':
                case 'cartao_debito': salesCard += order.total; break;
                case 'pix': salesPix += order.total; break;
            }
        });

        sessionInitialAmount.textContent = formatCurrency(cash.initialAmount);
        sessionSalesCash.textContent = formatCurrency(salesCash);
        sessionSalesCard.textContent = formatCurrency(salesCard);
        sessionSalesPix.textContent = formatCurrency(salesPix);
        sessionTotalSales.textContent = formatCurrency(totalSessionSales);
        sessionExpectedInCash.textContent = formatCurrency(cash.initialAmount + salesCash);
        cashSessionReportDiv.style.display = 'block';
    }

    printCashSessionReportBtn.addEventListener('click', () => {
        const cash = appData.cashRegister;
        let title;
        if (cash.isOpen) {
            title = `Relatório de Caixa - Sessão Atual (Aberta)`;
        } else if (cash.closeTime) {
            title = `Relatório de Caixa - Sessão Fechada`;
        } else {
            alert("Nenhuma sessão de caixa para imprimir.");
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 12px; width: 90%; margin: auto; }
                    h3, h4 { text-align: center; }
                    hr { border-top: 1px dashed #000; }
                    p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <h3>${appData.settings.establishmentName}</h3>
                <h4>${title}</h4>
                <p><strong>Abertura:</strong> ${sessionOpenTime.textContent}</p>
                <p><strong>Fechamento:</strong> ${sessionCloseTime.textContent}</p>
                <hr>
                <p><strong>Valor Inicial:</strong> R$ ${sessionInitialAmount.textContent}</p>
                <p><strong>Vendas (Dinheiro):</strong> R$ ${sessionSalesCash.textContent}</p>
                <p><strong>Vendas (Cartão):</strong> R$ ${sessionSalesCard.textContent}</p>
                <p><strong>Vendas (PIX):</strong> R$ ${sessionSalesPix.textContent}</p>
                <p><strong>Total Vendas na Sessão:</strong> R$ ${sessionTotalSales.textContent}</p>
                <hr>
                <p><strong>Valor Esperado em Caixa (Inicial + Dinheiro):</strong> R$ ${sessionExpectedInCash.textContent}</p>
                <p style="text-align: center; margin-top: 20px; font-size: 10px;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });


    // --- Initialization ---
    function loadInitialData() {
        loadData();
        loadSettings();
        renderCategories();
        renderProducts();
        renderPosProducts();
        renderSalesReports();
        resetCurrentOrder(false);
        updateCashManagementUI();

        [productModal, categoryModal].forEach(modalInstance => {
            modalInstance._element.addEventListener('hidden.bs.modal', function () {
                editingItemId = null;
                if (this.id === 'productModal') document.getElementById('productModalLabel').textContent = 'Adicionar Produto';
                if (this.id === 'categoryModal') document.getElementById('categoryModalLabel').textContent = 'Adicionar Categoria';
            });
        });
    }

    loadInitialData();
});