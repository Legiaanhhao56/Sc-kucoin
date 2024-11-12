(function() {
    'use strict';

    let autoClickerRunning = false; // Trạng thái ban đầu của tính năng auto click (tắt)
    let toggleStatus = false;       // Trạng thái toggle ban đầu (tắt)

    // Hàm random số trong khoảng min và max
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Hàm click vào vị trí ngẫu nhiên trong một phần tử
    function clickRandomInsideElement(element) {
        const rect = element.getBoundingClientRect();
        const x = getRandomInt(rect.left, rect.right);
        const y = getRandomInt(rect.top, rect.bottom);

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        element.dispatchEvent(clickEvent);
    }

    // Hàm lấy giá trị năng lượng hiện tại
    function getCurrentEnergy() {
        const energyElement = document.querySelector('.process--W73kB');
        if (!energyElement) return null;

        const currentEnergy = parseInt(energyElement.querySelector('span').textContent, 10);
        return isNaN(currentEnergy) ? null : currentEnergy;
    }

    // Hàm tìm phần tử cần click
    function findTargetElement() {
        return document.querySelector('#root > div.container--WYn0q.feedContainer--pPRP_.feedContainer > div:nth-child(2) > div.mainTouch--DToch > div > div.frog--GPU1j');
    }

    // Hàm khởi động auto click
    function startAutoClicker() {
        if (!toggleStatus) return;  // Chỉ chạy nếu toggle bật
        const element = findTargetElement();

        if (!element) {
            console.log('Элемент не найден, повторяю попытку...');
            setTimeout(startAutoClicker, 1000);
            return;
        }

        const currentEnergy = getCurrentEnergy();

        if (currentEnergy === 0) {
            const pauseDuration = getRandomInt(30000, 60000);
            console.log(`Энергия на нуле, пауза на ${pauseDuration / 1000} секунд`);
            setTimeout(startAutoClicker, pauseDuration);
        } else {
            clickRandomInsideElement(element);
            const clickInterval = getRandomInt(100, 250);
            setTimeout(startAutoClicker, clickInterval);
        }
    }

    // Hàm khởi tạo auto clicker
    function initializeAutoClicker() {
        if (!autoClickerRunning && window.location.href.includes('/miniapp/tap-game')) {
            console.log('Инициализация автокликера...');
            autoClickerRunning = true;
            setTimeout(startAutoClicker, 5000);
        }
    }

    // Thêm nút toggle vào trang
    function addToggleButton() {
        const button = document.createElement('button');
        button.id = 'autoClickerToggleButton';
        button.textContent = 'Bật Auto Clicker';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000';

        // Thay đổi trạng thái toggle khi nhấn vào nút
        button.addEventListener('click', () => {
            toggleStatus = !toggleStatus;
            button.textContent = toggleStatus ? 'Tắt Auto Clicker' : 'Bật Auto Clicker';
            button.style.backgroundColor = toggleStatus ? '#dc3545' : '#007bff';
            console.log(`Auto Clicker ${toggleStatus ? 'Đã Bật' : 'Đã Tắt'}`);
            if (toggleStatus && autoClickerRunning) {
                startAutoClicker();
            }
        });

        document.body.appendChild(button);
    }

    initializeAutoClicker();

    // Theo dõi thay đổi DOM
    const observer = new MutationObserver(() => {
        initializeAutoClicker();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Thêm nút toggle khi trang tải
    addToggleButton();
})();
