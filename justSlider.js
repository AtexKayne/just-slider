/**
 * Инициализация слайдера для карточек на странице региона
 */
 export default (slСontainer, slItems) => {
    const $container = document.querySelector(slСontainer)

    if(!$container || document.body.clientWidth > 767) return

    let $cards = $container.querySelectorAll(slItems),
        currentCard = 0,
        startCoord = 0,
        dist = 0,
        X = -15
    
    const cardWidth = $cards[0].offsetWidth + 15,

    translateX = (elements = '', x) => {
        if (elements.forEach) {
            elements.forEach( el => {
                el.style.transform = `translateX(${x}px)`
            })
        } else if (elements) {
            elements.style.transform = `translateX(${x}px)`
        } else {
            $cards[currentCard].style.transform = `translateX(16px)` 
        }
    },

    increment = type => {
        switch (type) {
            case 'minus':
                currentCard--
                X -= cardWidth
                break
            case 'plus':
                currentCard++
                X += cardWidth;
                break
            default:
                break
        }
        $container.removeEventListener('mousemove', swipeCard)
        $container.removeEventListener('touchmove', swipeCard);
        (X <= -15) ? translateX($cards, 16) : translateX($cards, -(X))
    },

    updateCards = () => {
        $cards = $container.querySelectorAll(slItems)
    },

    where = val => {
        if (val >= cardWidth  && currentCard > 0) currentCard--
        if (val <= -cardWidth && currentCard < $cards.length - 1) currentCard++;

        if (val >= cardWidth / 2 && currentCard > 0) {
            return 'minus' 
        } else if (val <= -(cardWidth / 2) && currentCard < $cards.length - 1) {
            return 'plus'
        } else {
            return false
        }
    },  

    swipeCard = event => {
        event.preventDefault()
        dist = event.changedTouches
            ? event.changedTouches[0].clientX - startCoord
            : event.clientX - startCoord
        translateX($cards, dist-X)
        const isSwipe = where(dist)
        if (isSwipe) increment(isSwipe)
    },

    add = (action, fn) => {
        return $container.addEventListener(action, fn)
    }

    
    add('touchstart', event => {
        updateCards()
        startCoord = parseInt(event.changedTouches[0].clientX)
        add('touchmove', swipeCard)
    })
    
    add('touchend', () => {
        increment();
        (currentCard === 0) 
            ? translateX()
            : translateX($cards, -X)
    })

    add('wheel', event => {
        updateCards()
        const isSwipe = where(-event.deltaY)
        if (isSwipe) {
            event.preventDefault()
            increment(isSwipe)
        }
    })

    add('mousedown', event => {
        updateCards()
        startCoord = parseInt(event.clientX)
        add('mousemove', swipeCard)
    })

    add('mouseup', event => {
        event.preventDefault()
        increment();
        (currentCard === 0) 
            ? translateX()
            : translateX($cards, -X)
    })

    add('mousleave', event => {
        event.preventDefault()
        increment();
        (currentCard === 0) 
            ? translateX()
            : translateX($cards, -X)
    })
}
