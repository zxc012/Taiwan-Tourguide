import { getAllAttractionsCount, getOverviewAttractionsData } from "./dataService";
import { createNewCard, createPaginationButtons, renderContent } from "./domService";
import { paginationController } from "./paginationService";


const cardPerPage = 12;
let length, dataList;

function render(element, innerHTML) {
    element.innerHTML += innerHTML;
}

/** 滑鼠滾輪觸發函式
 * 
 * 修改上方固定導覽列樣式
 */
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

function onSearchOptionsChange(event) {
    const banner = document.getElementById('banner')
    const title = document.getElementById('title')

    // 修改搜尋標題
    title.textContent = event.target.dataset.text;

    // 修改banner背景圖片
    const bannerUrl = require(`../images/banner-${event.target.id}.png`)
    banner.setAttribute('style', `background-image: url(${bannerUrl})`);

    history.pushState({ test: 123 }, '', `/${event.target.id}/`)
}

function onPaginationChange(event, pagination) {
    console.log('event :>> ', event);
    const cardList = document.querySelector('#cardList');
    console.log('pagination[event.target.dataset.action] :>> ', pagination[event.target.dataset.action]);
    console.log('event.target.dataset.value :>> ', event.target.dataset.value);
    pagination[event.target.dataset.action](event.target.dataset.value)

    // pagination.toPage(event.target.value)
    // renderContent(cardList,)
    history.pushState({ page: pagination.getCurrentPage() }, '', `?page=${pagination.getCurrentPage()}`)
}

async function onSearchBtnClick() {
    const cardList = document.querySelector('#cardList');
    const searchCityElement = document.querySelector('#searchCity');
    const searchCity = searchCityElement.value;
    const searchTextElement = document.querySelector('#searchText');
    const searchText = searchTextElement.value;

    length = await getAllAttractionsCount(searchCity, searchText)
    dataList = await getOverviewAttractionsData(searchCity, searchText)
    console.log(length);
    console.log(dataList)

    history.pushState({ searchCity: searchCity, searchText: searchText }, '', '?' + (searchCity ? `searchCity=${searchCity}` : '') + (searchText ? `&searchText=${searchText}` : ''))

    cardList.innerHTML = ''

    cardList.classList.toggle('row-cols-md-4', dataList.length !== 0)


    if (dataList.length === 0) {
        cardList.innerHTML = `<h3 class="col">找不到關鍵字為 "${searchCity ? searchCityElement.selectedOptions[0].label + ' ' : ''}${searchText}" 的資料，請重新輸入其他關鍵字搜尋。</h3>`
        return;
    }

    // 畫面渲染
    for (let i = 0; i < cardPerPage && i < dataList.length; i++) {
        // cardList.innerHTML += createNewCard(dataList[i])
        render(cardList, createNewCard(dataList[i]))
    }

}


export async function main() {
    // const url = new URL(location.href);
    // console.log(url)
    window.onpopstate = (event) => {
        // console.log('onpopstate :>> ', event);

    }

    // banner圖片及文字處理
    document.querySelector('#searchOptions')
        .addEventListener('change', (event) => onSearchOptionsChange(event))

    // 導覽列滾動效果
    window.addEventListener('scroll', () => onWindowScroll())

    // 點擊搜尋按鈕
    document.querySelector('#searchBtn')
        .addEventListener('click', async () => onSearchBtnClick())

    window.addEventListener('popstate', (event) => {
        // console.log('event', event);
        // 根據url產生指定的element

        // 重新渲染畫面
    })

    // 取得資料
    const cardList = document.querySelector('#cardList');

    const dataCount = await getAllAttractionsCount()
    const dataList = await getOverviewAttractionsData()
    console.log(dataCount);
    console.log(dataList);



    const totalPage = dataCount % cardPerPage === 0 ? dataCount / cardPerPage : Math.trunc(dataCount / cardPerPage) + 1

    const renderPage = (page) => {
        const currentStartCardIndex = (page - 1) * cardPerPage;
        const cardList = document.querySelector('#cardList');

        renderContent({ element: cardList, contentList: dataList.slice(currentStartCardIndex, currentStartCardIndex + cardPerPage), createRenderElement: createNewCard })

        // for (let cardIndex = currentStartCardIndex; cardIndex < page * cardPerPage && cardIndex < dataCount; cardIndex++) {
        //     render(cardList, createNewCard(dataList[cardIndex]))
        // }
    }


    const pagination = paginationController({ totalPage: totalPage, currentPage: 1, onChange: (page) => renderPage(page) })
    // console.log('pagination :>> ', pagination);

    const paginationButtons = createPaginationButtons(pagination.createPageButtonStatusList())
    // console.log('paginationButtons :>> ', paginationButtons);

    const searchResultElement = document.getElementById('searchResult');
    searchResultElement.appendChild(paginationButtons);

    const paginationContainer = document.getElementById('paginationContainer');

    paginationContainer.addEventListener('click', () => onPaginationChange(event, pagination));


    // 畫面渲染
    for (let i = 1; i <= cardPerPage && i <= dataList.length; i++) {
        // cardList.innerHTML += createNewCard(dataList[i])

        render(cardList, createNewCard(dataList[i]))
    }

    // const url = new URL(location.href)
    // url.searchParams.get
}

main();

