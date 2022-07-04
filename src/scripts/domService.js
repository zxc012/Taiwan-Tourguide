const locationIcon = require("../images/icon-location.svg");
const errorImg = require("../images/error-image.svg")
// const previousPageIcon = require("../images/icon-previous-page.svg")
// const nextPageIcon = require("../images/icon-next-page.svg")

export function renderContent({ element, createRenderElement, contentList }) {
  element.innerHTML = contentList.map((content) => createRenderElement(content)).join('');
}

export function createNewCard({ tagList, imageUrl, imageDescription, title, city }) {
  const tagHtml = tagList[0] !== undefined ? tagList
    .map((tag) => `<span class="badge bg-secondary me-1">${tag}</span>`)
    .join("") : '';

  imageDescription = imageDescription ?? title

  return `
    <div class="col">
      <a href="#" class="card h-100 border-2 rounded-2 shadow overflow-hidden text-decoration-none">
        <img src="${imageUrl}" title="${imageDescription}" alt="圖片載入失敗" onerror="this.src='${errorImg}'" class="card-image h-190px">
        <div class="card-body">
          <p class="card-title">${title}</p>
          <div class="card-text d-flex align-items-center">
            <img src=${locationIcon} alt="地點icon" class="icon-location">
            <span class="text-primary text-decoration-underline">${city}</span>
          </div>
        </div>
        <div class="card-footer border-0 bg-body">
          ${tagHtml}
        </div>
      </a>
    </div>
  `;
}


// export function createPaginationButtons(pageButtonStatusList) {
//   const paginationContainer = document.createElement('ul');
//   paginationContainer.classList.add(...['pagination-container', 'd-flex', 'justify-content-center', 'list-unstyled', 'text-decoration-none', 'pb-5', 'mb-0'])
//   paginationContainer.setAttribute('id', 'paginationContainer')

//   pageButtonStatusList.forEach(btnStatus => {
//     const btnElement = document.createElement('li');
//     btnElement.classList.add(...['pagination-item', 'd-flex', 'align-items-center', 'justify-content-center'])

//     const linkElement = document.createElement('a');

//     linkElement.href = '#'


//     // 回上一頁按鈕
//     if (btnStatus.value === 'PreviousPage') {
//       btnElement.classList.add('me-2')
//       linkElement.innerHTML = `<img src="${previousPageIcon}" alt="回上一頁" />`
//       // btnElement.innerHTML = `<a href="#"><img src="${previousPageIcon}" alt="回上一頁" /></a>`
//     }
//     // 到下一頁按鈕
//     else if (btnStatus.value === 'NextPage') {
//       btnElement.classList.add('ms-2')
//       linkElement.innerHTML = `<img src="${nextPageIcon}" alt="回上一頁" />`
//       // btnElement.innerHTML = `<a href="#"><img src="${nextPageIcon}" alt="回上一頁" /></a>`
//     }
//     else {
//       btnElement.classList.add('mx-2')
//       linkElement.textContent = btnStatus.value
//       // btnElement.innerHTML = `<a href="#">${btnStatus.value}</a>`
//     }
//     linkElement.setAttribute('data-value', btnStatus.value);
//     linkElement.setAttribute('data-action', btnStatus.action);
//     linkElement.setAttribute('data-active', btnStatus.active);
//     linkElement.setAttribute('data-disabled', btnStatus.disabled);

//     btnElement.appendChild(linkElement)
//     paginationContainer.appendChild(btnElement);
//   })

//   return paginationContainer
// }

