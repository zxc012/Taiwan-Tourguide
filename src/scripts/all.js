import { getAttractionsData, getAttractionsCount } from "./dataService";
import { createNewCard } from "./domService";

export async function main() {
    const cardList = document.querySelector('#cardList');


    const length = await getAttractionsCount()
    console.log('length :>> ', length);

    const dataList = await getAttractionsData()
    console.log('dataList :>> ', dataList);

    dataList.forEach(data => {
        cardList.innerHTML += createNewCard(data.Picture.PictureUrl1, data.Name, data.Picture.PictureDescription1, data.Address.substr(0, 3), [data.Class1, data.Class2, data.Class3])
    })

    window.addEventListener('scroll', e => {
        const header = document.querySelector('#header')
        const logo = document.querySelector('#logo')
        if (window.scrollY > 1) {
            header.classList.add('bg-white', 'shadow')
            logo.classList.add('logo-drop')
        }
        else {
            header.classList.remove('bg-white', 'shadow')
            logo.classList.remove('logo-drop')
        }
    })
}

main();

