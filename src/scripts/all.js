import { getAttractionsData, getAttractionsCount } from "./dataService";
import { createNewCard } from "./domService";




export async function main() {
    // 搜尋列點擊效果
    const searchOptions = document.querySelector('#searchOptions')
    console.log(searchOptions)

    // banner圖片及文字處理
    const banner = document.getElementById('banner')
    const title = document.getElementById('title')
    searchOptions.addEventListener('change', function (event) {
        title.textContent = event.target.dataset.text;
        const bannerUrl = require(`../images/banner-${event.target.id}.png`)
        banner.setAttribute('style', `background-image: url(${bannerUrl})`);
    })


    // 導覽列滾動效果
    window.addEventListener('scroll', e => {
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
    })

    const cardList = document.querySelector('#cardList');


    const length = await getAttractionsCount()
    const dataList = await getAttractionsData()

    dataList.forEach(data => {
        cardList.innerHTML += createNewCard(data.Picture.PictureUrl1, data.Name, data.Picture.PictureDescription1, data.Address.substr(0, 3), [data.Class1, data.Class2, data.Class3])
    })



}

main();

