import { getAuthorizationHeader, getAllScenicSpotData, getAllRestaurantData, getAllHotelData, getAllActivityData } from "./dataService";
import { createNewCard, renderContent } from "./domService";
import { createPaginationButtons, createPaginationController, createPaginationStatusList } from "./paginationService";

// 設定每頁最大顯示卡片數量
const cardPerPage = 12;
let dataList, dataCount;
let paginationController;


/** 頁面滾輪修改上方導覽列樣式 */
function onWindowScroll() {
    const header = document.querySelector('#header')
    const logo = document.querySelector('#logo')

    if (window.scrollY > 0) {
        header.classList.add('bg-white', 'shadow')
        logo.classList.add('logo-drop')
    }
    else {
        header.classList.remove('bg-white', 'shadow')
        logo.classList.remove('logo-drop')
    }
}

/** 搜尋種類變更時觸發事件 */
function onSearchOptionsChange(event) {
    const banner = document.getElementById('banner')
    const title = document.getElementById('title')

    // 修改搜尋標題
    title.textContent = event.target.dataset.text;

    // 修改banner背景圖片
    const bannerUrl = require(`../images/banner-${event.target.id}.png`)
    banner.setAttribute('style', `background-image: url(${bannerUrl})`);

    // 修改搜尋文字提示文字
    const searchText = document.querySelector('#searchText');
    searchText.placeholder = `輸入${title.textContent}名稱`;
    // history.pushState({}, '', `/${event.target.id}/`)
}

/** 換頁按鈕按下時觸發事件 */
function onPaginationClick(event) {
    // 僅在target為li元素時，才執行換頁功能
    if (event.target.tagName.toLowerCase() === 'ul') return;

    let target = event.target.tagName.toLowerCase() === 'li' ? event.target : event.target.closest('li');
    if (target.dataset.disabled === 'true') return;

    if (target.dataset.action === 'gotoPage') {
        paginationController[target.dataset.action](+target.dataset.value);
    }
    else {
        paginationController[target.dataset.action]();
    }

    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
}

async function onSearchBtnClick() {
    const searchType = document.querySelector('[name=options]:checked').id;
    const cardList = document.querySelector('#cardList');
    const searchCityElement = document.querySelector('#searchCity');
    const searchCity = searchCityElement.value;
    const searchTextElement = document.querySelector('#searchText');
    const searchText = searchTextElement.value;

    if (searchType == 'scenicSpot') {
        dataList = await getAllScenicSpotData(searchCity, searchText)
    }
    else if (searchType == 'restaurant') {
        dataList = await getAllRestaurantData(searchCity, searchText)
    }
    else if (searchType == 'hotel') {
        dataList = await getAllHotelData(searchCity, searchText)
    }
    else if (searchType == 'activity') {
        dataList = await getAllActivityData(searchCity, searchText)
    }

    window.scroll({
        top: 0,
        behavior: 'smooth'
    });


    // 資料總筆數
    dataCount = dataList.length;

    cardList.classList.toggle('row-cols-md-4', dataList.length !== 0)

    if (dataCount === 0) {
        cardList.innerHTML = `<h3 class="col">找不到關鍵字為 "${searchCity ? searchCityElement.selectedOptions[0].label + ' ' : ''}${searchText}" 的資料，請重新輸入其他關鍵字搜尋。</h3>`
        const paginationContainer = document.querySelector('#pagination');
        paginationContainer.innerHTML = '';
        return;
    }

    // 計算總頁數
    const totalPage = Math.ceil(dataCount / cardPerPage)

    // 換頁時執行的功能
    const onPageChange = (page) => {
        // 建立換頁按鈕狀態
        const paginationButtonStatus = createPaginationStatusList({ totalPage: totalPage, currentPage: page })

        // 建立實際換頁按鈕
        const paginationButtons = createPaginationButtons(paginationButtonStatus);

        // 重新渲染換頁按鈕
        const paginationContainer = document.querySelector('#pagination')
        paginationContainer.innerHTML = paginationButtons.innerHTML;

        // 重新渲染搜尋結果
        const currentStartCardIndex = (page - 1) * cardPerPage;
        const cardList = document.querySelector('#cardList');

        renderContent({ element: cardList, contentList: dataList.slice(currentStartCardIndex, currentStartCardIndex + cardPerPage), createRenderElement: createNewCard })
    }

    // 換頁元件控制器
    paginationController = createPaginationController({ totalPage: totalPage, currentPage: 1, onPageChange: onPageChange })

    // 畫面初始化
    paginationController.gotoFirstPage();


}


export async function main() {
    // 事件綁定：導覽列滾動效果
    window.addEventListener('scroll', () => onWindowScroll())

    // 事件綁定：banner圖片及文字處理
    document.querySelector('#searchOptions')
        .addEventListener('change', (event) => onSearchOptionsChange(event))

    // 事件綁定：點擊搜尋按鈕
    document.querySelector('#searchBtn')
        .addEventListener('click', async () => onSearchBtnClick())

    // 事件綁定：點擊換頁按鈕
    document.querySelector('#pagination').addEventListener('click', (event) => onPaginationClick(event));

    // 取得API授權資料
    await getAuthorizationHeader();

    // 頁面初始化
    onSearchBtnClick()
}

main();

