document.addEventListener('keydown', e => {
    e.preventDefault()
    if (e.code.toLowerCase() === 'space') {
        setRandomColors()
    }
})

// click-handling of coping hex and locking the color
document.addEventListener('click', e => {
    const type = e.target.dataset.type

    if (type === 'lock') {
        const node = e.target.tagName.toLowerCase() === 'i'
            ? e.target
            : e.target.children[0]

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    }
    else if (type === 'copy') {
        copyToClipBoard(e.target.textContent)
    }
})

const columns = document.querySelectorAll('.col')

//simple hex randomizer
const getRandomHex = () => {
    const hexCodex = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++) {
        color += hexCodex[Math.floor(Math.random() * hexCodex.length)]
    }
    return '#' + color
}

// using chroma lib to define the color of title: white or black
const setTextColor = (text, color) => {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

const setRandomColors = (isInitial) => {
    const colors = isInitial ? getColorsFromHash() : []
    columns.forEach((col, index) => {
        const title = col.querySelector('h2')
        const button = col.querySelector('button')
        const color = isInitial ? colors[index] || getRandomHex() : getRandomHex() //or chroma.random()

        const isLocked = col.querySelector('i').classList.contains('fa-lock')
        if (isLocked) {
            colors.push(title.textContent)
            return
        }
        if (!isInitial) {
            colors.push(color)
        }

        title.textContent = color
        col.style.background = color
        setTextColor(title, color)
        setTextColor(button, color)
        updateColorsHash(colors)
    })
}

const copyToClipBoard = text => {
    return navigator.clipboard.writeText(text)
}

// hash is used to give the user an opportunity to share the generated palette via link
const updateColorsHash = (colors = []) => {
    document.location.hash = colors.map(color => color.toString().substring(1)).join('-')
}

const getColorsFromHash = () => {
    if (document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color)
    } else return []
}

setRandomColors(true)