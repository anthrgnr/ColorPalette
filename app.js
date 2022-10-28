// initializing Notiflix to show copy popup
Notiflix.Notify.init({
    width: 'fit-content',
    timeout: 1800,
    borderRadius: '12px',
    fontSize: '16px',
    useIcon: false,
    success: {
        background: '#444444'
    }
})

document.addEventListener('keydown', e => {
    const code = e.code.toLowerCase()
    if (R.equals(code, 'space')) {
        e.preventDefault()
        document.querySelectorAll('.col').forEach(column => setColumnColor(column))
    }
    if (R.equals(code, 'keyn')) {
        addLastColumn()
    }
    if (R.equals(code, 'keyd')) {
        R.last(document.querySelectorAll('.col')).remove()
    }
})

// click-handling of coping hex and locking the color
document.addEventListener('click', e => {
    const type = e.target.dataset.type

    if (R.equals(type, 'lock')) {
        const node = R.equals(e.target.tagName.toLowerCase(), 'i')
            ? e.target
            : R.head(e.target.children)

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    }
    else if (R.equals(type, 'copy')) {
        copyToClipBoard(e.target.textContent).
            then(Notiflix.Notify.success('HEX copied!'))
    }
    else if (R.equals(type, 'delete')) {
        const columnsCount = R.length(document.querySelectorAll('.col'))
        if (columnsCount > 1) {
            e.target.closest('.col').remove()
        }
        if (R.equals(columnsCount, 2)) {
            document.querySelector('.col #delete').disabled = true
        }
    }
})

//simple hex randomizer
const getRandomHex = () => {
    const hexCodex = '0123456789ABCDEF'
    let color = ''
    for (let i = 0; i < 6; i++) {
        color += hexCodex[Math.floor(Math.random() * R.length(hexCodex))]
    }
    return '#' + color
}

// using chroma lib to define the color of title: white or black
const setTextColor = (text, color) => {
    const luminance = chroma(color).luminance()
    text.style.color = luminance > 0.5 ? 'black' : 'white'
}

const setColumnColor = column => {
    const isLocked = column.querySelector('#lockIcon').classList.contains('fa-lock')
    if (isLocked) return

    const title = column.querySelector('h2')
    const buttons = column.querySelectorAll('button')
    const color = getRandomHex() //or chroma.random()

    title.textContent = color
    column.style.background = color
    setTextColor(title, color)
    buttons.forEach(button => setTextColor(button, color))
}

const copyToClipBoard = text => {
    return navigator.clipboard.writeText(text)
}

// a method to create a column with all its buttons
const createColumn = () => {
    const column = document.createElement('div')
    column.classList.add('col')

    const title = document.createElement('h2')
    title.dataset.type = 'copy'

    const buttons = document.createElement('div')
    buttons.classList.add('buttons')

    const createButton = (buttonType, iconClasses) => {
        const button = document.createElement('button')
        button.dataset.type = buttonType
        const icon = document.createElement('i')
        icon.dataset.type = buttonType
        icon.classList.add(...iconClasses)
        icon.id = buttonType + 'Icon'
        button.append(icon)
        button.id = buttonType
        return button
    }

    const deleteButton = createButton('delete', ['fa-regular', 'fa-xmark'])
    const lockButton = createButton('lock', ['fa-solid', 'fa-lock-open'])
    buttons.append(deleteButton, lockButton)

    column.append(title, buttons)
    setColumnColor(column)

    return column
}

const addColumn = () => {
    const body = document.querySelector('body')
    body.append(createColumn())
}

const addLastColumn = () => {
    const body = document.querySelector('body')
    const addButton = body.querySelector('#add')
    body.insertBefore(createColumn(), addButton)
}

for (let i = 0; i < 4; i++) {
    addColumn()
}