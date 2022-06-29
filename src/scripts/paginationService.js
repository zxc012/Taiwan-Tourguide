/** 「回到上一頁」按鈕圖示 */
const previousPageIcon = require("../images/icon-previous-page.svg")
/** 「前往下一頁」按鈕圖示 */
const nextPageIcon = require("../images/icon-next-page.svg")

// Step1. 建立換頁元件控制器: 透過函數閉包的方式儲存總頁數、目前頁碼等狀態至一個物件內，
//        並在物件內提供改變目前頁碼的功能，改變頁碼後再執行改變頁碼後要執行的事情。
// Step2. 建立換頁按鈕狀態: 根據總頁數及目前的頁碼決定會有幾頁的按鈕會顯示出來
// Step3. 建立換頁按鈕DOM物件: 根據Step2的換頁按鈕狀態建立所有的換頁按鈕
// Step4. 實作換頁時觸發事件: 換頁時重新渲染搜尋結果、換頁元件
// Step5. 綁定換頁元件按鈕事件: 按下按鈕時，觸發換頁按鈕狀態的action函式，以換到指定的頁碼。

/** 建立換頁元件控制器 */
export function createPaginationController({ totalPage, currentPage, onPageChange }) {
    /** 取得目前頁碼 */
    const getCurrentPage = () => currentPage;
    /** 前往頁碼(page)，並執行畫面換頁功能 */
    const gotoPage = (page) => {
        currentPage = page;
        onPageChange(currentPage);
    }
    /** 前往第一頁 */
    const gotoFirstPage = () => gotoPage(1);
    /** 前往最後一頁 */
    const gotoLastPage = () => gotoPage(totalPage);
    /** 前往下一頁 */
    const gotoNextPage = () => gotoPage(currentPage + 1);
    /** 回到上一頁 */
    const gotoPreviousPage = () => gotoPage(currentPage - 1);

    return {
        getCurrentPage,
        gotoPage,
        gotoFirstPage,
        gotoLastPage,
        gotoNextPage,
        gotoPreviousPage,
    }
}

/** 建立換頁按鈕狀態的陣列 */
export function createPaginationStatusList({ totalPage, currentPage }) {
    /** 設定頁碼範圍數量(目前頁碼前後最多顯示出幾頁) */
    const rangeCount = 5;
    /** 頁碼範圍起始 */
    const rangeStart = currentPage - Math.trunc(rangeCount / 2);
    /** 頁碼範圍結尾 */
    const rangeEnd = rangeStart + rangeCount - 1;

    // 狀態說明
    // [value]: 顯示頁碼或功能
    // [disabled]: 按鈕是否啟用
    // [active]: 是否為目前頁碼
    // [action]: 按下按鈕之後要執行的函式名稱
    /** 取得「回到上一頁」按鈕狀態 */
    const getPreviousPageStatus = () => ([{ value: 'previous', disabled: currentPage === 1, active: false, action: 'gotoPreviousPage' }])
    /** 取得「前往下一頁」按鈕狀態 */
    const getNextPageStatus = () => ([{ value: 'next', disabled: currentPage === totalPage, active: false, action: 'gotoNextPage' }])
    /** 取得「回到第一頁」按鈕狀態 */
    const getFirstPageStatus = () => ([{ value: 1, disabled: currentPage === 1, active: currentPage === 1, action: 'gotoFirstPage' }]);
    /** 取得「前往最後一頁」按鈕狀態 */
    const getLastPageStatus = () => ([{ value: totalPage, disabled: currentPage === totalPage, active: currentPage === totalPage, action: 'gotoLastPage' }])
    /** 取得「省略頁碼(...)」按鈕狀態 */
    const getOmittedPageStatus = () => ([{ value: '...', disabled: true, active: false, action: null }])
    /** 取得「範圍頁碼」按鈕狀態 */
    const getRangePageStatus = () => {
        const rangePageArray = Array(rangeCount).fill(rangeStart).map((value, index) => value + index).filter(page => 1 <= page && page <= totalPage);
        const rangePage = rangePageArray.map(value => ({ value: value, disabled: value === currentPage, active: value === currentPage, action: 'gotoPage' }))
        return rangePage;
    }

    return [
        ...getPreviousPageStatus(),                                     // 回到上一頁
        ...(rangeStart > 1 ? getFirstPageStatus() : []),                // 回到第一頁
        ...(rangeStart - 1 > 1 ? getOmittedPageStatus() : []),          // 省略頁碼(...)
        ...(getRangePageStatus()),                                      // 範圍頁碼(Ex: 3,4,5,6,7)
        ...(totalPage - rangeEnd > 1 ? getOmittedPageStatus() : []),    // 省略頁碼(...)
        ...(rangeEnd < totalPage ? getLastPageStatus() : []),           // 前往最後一頁
        ...getNextPageStatus()                                          // 前往下一頁
    ]
}

/** 建立換頁按鈕 */
export function createPaginationButtons(paginationStatusList) {
    /** 換頁按鈕容器 */
    const paginationContainerElement = document.createElement('ul');

    // 產生每個換頁按鈕DOM物件
    paginationStatusList.forEach(buttonStatus => {
        const paginationButtonElement = document.createElement('li');

        // 將狀態賦予至DOM物件的屬性上
        paginationButtonElement.dataset.value = buttonStatus.value;
        paginationButtonElement.dataset.disabled = buttonStatus.disabled;
        paginationButtonElement.dataset.active = buttonStatus.active;
        paginationButtonElement.dataset.action = buttonStatus.action;

        // 設定按鈕樣式
        paginationButtonElement.classList.add(...['d-flex', 'align-items-center', 'justify-content-center'])
        // 回上一頁按鈕
        if (buttonStatus.value === 'previous') {
            paginationButtonElement.classList.add('me-2')
            paginationButtonElement.innerHTML = `<img src="${previousPageIcon}" alt="回上一頁" />`
        }
        // 到下一頁按鈕
        else if (buttonStatus.value === 'next') {
            paginationButtonElement.classList.add('ms-2');
            paginationButtonElement.innerHTML = `<img src="${nextPageIcon}" alt="回上一頁" />`;
        }
        // 其餘按鈕
        else {
            paginationButtonElement.classList.add('mx-2');
            paginationButtonElement.textContent = buttonStatus.value;
        }


        paginationContainerElement.appendChild(paginationButtonElement)
    })

    return paginationContainerElement;
}