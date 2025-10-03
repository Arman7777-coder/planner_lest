document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');
    const taskView = document.getElementById('task-view');
    const pendingList = document.getElementById('pending-list');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Stats elements
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const overdueTasksEl = document.getElementById('overdue-tasks');

    // Microsoft Store Subscription State
    let digitalGoodsService = null;
    let isPremium = false; // Track if user has active premium subscription

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        {
            id: 1,
            title: 'Draft Project Proposal',
            description: 'Create a comprehensive proposal for the new project',
            category: 'Work',
            priority: 'High',
            dueDate: '2025-10-05',
            status: 'pending',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Review Marketing Analytics',
            description: 'Analyze Q3 marketing data and prepare report',
            category: 'Work',
            priority: 'Medium',
            dueDate: '2025-10-03',
            status: 'pending',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            title: 'Buy groceries',
            description: 'Weekly grocery shopping',
            category: 'Shopping',
            priority: 'Low',
            dueDate: '2025-10-04',
            status: 'completed',
            createdAt: new Date().toISOString()
        }
    ];
    let currentView = 'list';
    let currentTaskId = null;
    let taskIdCounter = Math.max(...tasks.map(t => t.id), 0) + 1;

    // Initialize Microsoft Store billing
    initStore().then(service => {
        digitalGoodsService = service;
        if (service) {
            // Check existing purchases
            syncOwnedPurchases(service);
            // Load product details
            showProducts(service);
        }
    });

    // Microsoft Store Digital Goods API Functions
    async function initStore() {
        if (!('getDigitalGoodsService' in window)) {
            console.warn('Digital Goods API not available.');
            return null;
        }

        try {
            // Only available when PWA is installed from Microsoft Store on Windows
            const service = await window.getDigitalGoodsService("https://store.microsoft.com/billing");
            return service;
        } catch (err) {
            console.warn('Store billing not available in this context:', err);
            return null;
        }
    }

    async function showProducts(service, productIds = ['monthly_subscription']) {
        // productIds = array of InAppOfferToken strings you created in Partner Center
        const details = await service.getDetails(productIds);
        // details is an array of item objects with price, title, description, itemId
        details.forEach(item => {
            const price = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: item.price.currency }).format(item.price.value);
            console.log('Product:', item.itemId, item.title, price, item.description);
            // TODO: render to your UI and wire buy button to purchaseProduct(...)
        });
        return details;
    }

    async function purchaseProduct(service, item) {
        // item.itemId should be the SKU (InAppOfferToken)
        const request = new PaymentRequest(
            [{
                supportedMethods: 'https://store.microsoft.com/billing',
                data: { sku: item.itemId } // the store SKU
            }],
            // Optionally pass details object (mostly ignored by store because store provides UI)
            {}
        );

        try {
            const response = await request.show(); // opens Microsoft Store purchase UI
            // response.details will include a purchase token
            const purchaseToken = response.details?.purchaseToken || response.details?.purchase_token || null;
            // Acknowledge / verify server-side
            await response.complete('success'); // tell the PaymentRequest we finished
            return { success: true, purchaseToken };
        } catch (err) {
            console.error('Purchase cancelled or failed:', err);
            return { success: false, error: err };
        }
    }

    async function syncOwnedPurchases(service) {
        // Get items user currently owns (excluding expired subscriptions)
        const purchaseList = await service.listPurchases();
        for (const p of purchaseList) {
            // p.itemId and p.purchaseToken available
            console.log('Owned:', p.itemId, p.purchaseToken);
            // Call your server to validate token and grant entitlement
            // await fetch('/verify-purchase', { method:'POST', body: JSON.stringify({ itemId: p.itemId, token: p.purchaseToken })});
            if (p.itemId === 'monthly_subscription') {
                isPremium = true;
            }
        }
        return purchaseList;
    }

    // Save to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Update premium status in UI
    function updatePremiumStatus() {
        const premiumIndicator = document.getElementById('premium-status');
        if (premiumIndicator) {
            premiumIndicator.textContent = isPremium ? 'Premium Active' : 'Free Version';
            premiumIndicator.style.color = isPremium ? 'var(--success)' : 'var(--text-secondary)';
        }
    }

    // Update stats
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const overdue = tasks.filter(t => t.status === 'overdue').length;

        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
        overdueTasksEl.textContent = overdue;
    }

    // Check for overdue tasks
    function checkOverdueTasks() {
        const today = new Date().toISOString().split('T')[0];
        tasks.forEach(task => {
            if (task.status === 'pending' && task.dueDate && task.dueDate < today) {
                task.status = 'overdue';
            }
        });
        saveTasks();
    }

    // Render task item
    function renderTaskItem(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.status}`;
        taskItem.dataset.id = task.id;

        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const priorityColor = task.priority === 'High' ? '#d13438' : task.priority === 'Medium' ? '#ff8c00' : '#107c10';

        taskItem.innerHTML = `
            <div class="task-header">
                <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''}>
                <div class="task-content">
                    <h3 class="task-title ${task.status === 'completed' ? 'completed' : ''}">${task.title}</h3>
                    <span class="task-category category-${task.category.toLowerCase()}">${task.category}</span>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-meta">
                <span class="task-priority" style="color: ${priorityColor}">${task.priority} Priority</span>
                <span class="task-due-date">Due: ${dueDate}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-primary" data-action="edit">Edit</button>
                <button class="btn btn-danger" data-action="delete">Delete</button>
            </div>
        `;

        return taskItem;
    }

    // Render task list
    function renderTaskList(filteredTasks = tasks) {
        taskView.innerHTML = '<div class="task-list"></div>';
        const taskListEl = taskView.querySelector('.task-list');

        filteredTasks.forEach(task => {
            const taskItem = renderTaskItem(task);
            taskListEl.appendChild(taskItem);
        });
    }

    // Render calendar view
    function renderCalendarView() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        taskView.innerHTML = `
            <div class="calendar">
                <div class="calendar-header">
                    <h2 class="calendar-title">${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                    <div class="calendar-nav">
                        <button class="btn btn-secondary" id="prev-month">←</button>
                        <button class="btn btn-secondary" id="next-month">→</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
                </div>
            </div>
        `;

        const calendarGrid = taskView.querySelector('.calendar-grid');

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = date.getDate();

            if (date.toDateString() === now.toDateString()) {
                dayEl.classList.add('today');
            }

            if (date.getMonth() !== month) {
                dayEl.classList.add('other-month');
            }

            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = tasks.filter(t => t.dueDate === dateStr);
            if (dayTasks.length > 0) {
                dayEl.classList.add('has-tasks');
            }

            calendarGrid.appendChild(dayEl);
        }
    }

    // Render pending tasks
    function renderPendingTasks() {
        pendingList.innerHTML = '';
        const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue');

        pendingTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'pending-item';
            li.textContent = task.title;
            pendingList.appendChild(li);
        });
    }

    // Filter tasks
    function getFilteredTasks() {
        let filtered = [...tasks];
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilterValue = categoryFilter.value;

        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }

        if (categoryFilterValue) {
            filtered = filtered.filter(task => task.category === categoryFilterValue);
        }

        return filtered;
    }

    // Render current view
    function renderCurrentView() {
        // Hide all views first
        document.getElementById('task-view').style.display = 'none';
        document.getElementById('premium-view').style.display = 'none';

        if (currentView === 'list') {
            document.getElementById('task-view').style.display = 'block';
            renderTaskList(getFilteredTasks());
        } else if (currentView === 'calendar') {
            document.getElementById('task-view').style.display = 'block';
            renderCalendarView();
        } else if (currentView === 'premium') {
            document.getElementById('premium-view').style.display = 'block';
        }

        renderPendingTasks();
        updateStats();
    }

    // Open modal for adding/editing task
    function openTaskModal(task = null) {
        currentTaskId = task ? task.id : null;
        document.getElementById('modal-title').textContent = task ? 'Edit Task' : 'Add New Task';

        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-due-date').value = task.dueDate || '';
        } else {
            taskForm.reset();
        }

        taskModal.style.display = 'flex';
    }

    // Close modal
    function closeTaskModal() {
        taskModal.style.display = 'none';
        currentTaskId = null;
        taskForm.reset();
    }

    // Handle form submission
    function handleTaskSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const category = document.getElementById('task-category').value;
        const priority = document.getElementById('task-priority').value;
        const dueDate = document.getElementById('task-due-date').value;

        if (!title || !category) return;

        if (currentTaskId) {
            // Edit existing task
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    category,
                    priority,
                    dueDate
                };
            }
        } else {
            // Add new task
            const newTask = {
                id: taskIdCounter++,
                title,
                description,
                category,
                priority,
                dueDate,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            tasks.push(newTask);
        }

        saveTasks();
        checkOverdueTasks();
        renderCurrentView();
        closeTaskModal();
    }

    // Handle task actions
    function handleTaskAction(e) {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) return;

        if (target.classList.contains('task-checkbox')) {
            // Handle checkbox toggle
            const isChecked = target.checked;
            tasks[taskIndex].status = isChecked ? 'completed' : 'pending';
            if (!isChecked) checkOverdueTasks();
        } else {
            // Handle button actions
            const action = target.dataset.action;
            if (!action) return;

            switch (action) {
                case 'edit':
                    openTaskModal(tasks[taskIndex]);
                    return;
                case 'delete':
                    if (confirm('Are you sure you want to delete this task?')) {
                        tasks.splice(taskIndex, 1);
                    }
                    break;
            }
        }

        saveTasks();
        renderCurrentView();
    }

    // Event listeners
    addTaskBtn.addEventListener('click', () => openTaskModal());
    closeModal.addEventListener('click', closeTaskModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
    });
    taskForm.addEventListener('submit', handleTaskSubmit);

    // Subscribe button
    document.getElementById('subscribe-btn').addEventListener('click', async () => {
        if (!digitalGoodsService) {
            alert('Microsoft Store billing is not available. Please install the app from Microsoft Store to enable subscriptions.');
            return;
        }

        try {
            // Get product details first
            const products = await showProducts(digitalGoodsService, ['monthly_subscription']);
            if (products.length === 0) {
                alert('Subscription product not found. Please check your Partner Center configuration.');
                return;
            }

            // Purchase the first product (monthly subscription)
            const result = await purchaseProduct(digitalGoodsService, products[0]);
            if (result.success) {
                alert('Subscription purchased successfully! Premium features are now available.');
                isPremium = true;
                // Update UI to show premium status
                updatePremiumStatus();
            } else {
                alert('Purchase was cancelled or failed.');
            }
        } catch (error) {
            console.error('Subscription purchase error:', error);
            alert('An error occurred during purchase. Please try again.');
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderCurrentView();
        });
    });

    searchInput.addEventListener('input', renderCurrentView);
    categoryFilter.addEventListener('change', renderCurrentView);

    taskView.addEventListener('click', handleTaskAction);

    // Handle window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-render current view on resize to ensure proper layout
            renderCurrentView();
        }, 250);
    });

    // Handle orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            renderCurrentView();
        }, 100);
    });

    // Initialize
    checkOverdueTasks();
    renderCurrentView();
    updatePremiumStatus();
});