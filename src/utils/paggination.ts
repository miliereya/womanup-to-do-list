export const calculatePagginationArray = (step: number, length: number): number[] => {
    //step (number of items displayed on page)
    //length (number of items in array)
    //returns array of nums that shows how many items should be displayed on page

    let pages = length / step
    let paggArr: number[] = []

    if (pages !== Math.floor(pages)) {
        pages = Math.floor(pages) + 1
    }

    let i = 1
    while (i <= pages) {
        paggArr.push(i)
        i++
    }
    return paggArr
}

//Show results in choosen range
export const calculateShowingResults = (choosenPage: number, step: number, length: number) => {
    //step (number of items displayed on page)
    //length (number of items in array)
    //returns array of nums that shows how many items should be displayed on page

    let i = 1
    let result: number = i
    while (i < choosenPage) {
        result += step
        i++
    }
    let secondNum = result + step - 1

    if (secondNum > length) {
        while (secondNum > length) {
            secondNum--
        }
    }

    return `${result}-${secondNum}`
}