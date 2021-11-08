export function createNewCard(imgUrl, title, description, location, tagList) {
  const tagHtml = tagList.filter(Boolean)
    .map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')
  const icon = require('../images/icon-location.svg')

  return `
    <div class="col">
    <div class="card h-100 border-2 rounded-2 shadow overflow-hidden">
      <img src="${imgUrl}" alt="${description}" class="card-image h-190px">
      <div class="card-body">
        <p class="card-title">${title}</p>
        <div class="card-text d-flex align-items-center">
          <img src=${icon} alt="地點icon" class="icon-location">
          <span class="text-primary text-decoration-underline">${location}</span>
        </div>
      </div>
      <div class="card-footer border-0 bg-body">
        ${tagHtml}
      </div>
    </div>
  </div>
  `
}