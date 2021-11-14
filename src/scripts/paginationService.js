export function paginationController({ totalPage, currentPage, onChange }) {
    const toPage = (page) => {
        currentPage = page;
        // const pageButtonStatusList = createPageButtonStatusList(page)
        console.log(onChange);
        onChange(currentPage);
    }

    const getCurrentPage = () => {
        return currentPage
    }

    const skipPage = (page) => {

    }

    const toNextPage = () => {
        if (currentPage > 1) toPage(currentPage + 1);
    }

    const toPreviousPage = () => {
        if (currentPage < totalPage) toPage(currentPage - 1);
    }

    const toFirstPage = () => {
        toPage(1)
    }

    const toLastPage = () => {
        toPage(totalPage)
    }

    const createPageButtonStatusList = () => {
        const rangeCount = 5;

        const rangeStart = currentPage - Math.trunc(rangeCount / 2) > 0 ? currentPage - Math.trunc(rangeCount / 2) : 1;
        const pageRange = Array(rangeCount).fill(rangeStart).map((page, index) => page + index).filter(page => page < totalPage)
        const pageRangeBtn = pageRange.map(page => ({ disabled: false, active: currentPage === page, value: page, action: 'toPage' }))

        const toNextPageBtn = [{ disabled: currentPage === totalPage, active: false, value: 'NextPage', action: 'toNextPage' }]
        const toPreviousPageBtn = [{ disabled: currentPage === 1, active: false, value: 'PreviousPage', action: 'toPreviousPage' }]
        const toFirstPageBtn = rangeStart > 1 ? [{ disabled: false, active: false, value: 1, action: 'toFirstPage' }] : []
        const toLastPageBtn = rangeStart + rangeCount - 1 < totalPage ? [{ disabled: false, active: false, value: totalPage, action: 'toLastPage' }] : []
        const toOtherPageBtn = [{ disabled: true, active: false, value: '...', action: null }]

        return [
            ...toPreviousPageBtn,
            ...toFirstPageBtn,
            ...(rangeStart - 1 > 1 ? toOtherPageBtn : []),
            ...pageRangeBtn,
            ...(totalPage - (rangeStart + rangeCount - 1) > 1 ? toOtherPageBtn : []),
            ...toLastPageBtn,
            ...toNextPageBtn
        ]
    }

    return {
        toPage,
        getCurrentPage,
        toNextPage,
        toPreviousPage,
        toFirstPage,
        toLastPage,
        createPageButtonStatusList
    }
}