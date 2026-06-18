const PAW_LEFT_LIGHT = "images/paw-left.svg";
const PAW_RIGHT_LIGHT = "images/paw-right.svg";

const PAW_LEFT_DARK = "images/paw-left-dark.svg";
const PAW_RIGHT_DARK = "images/paw-right-dark.svg";

let lastX = 0;
let lastY = 0;
let lastTime = 0;
let leftFoot = true;


const lenis = new Lenis({
		duration: 1.4,
		smoothWheel: true,
		wheelMultiplier: 0.8,
		touchMultiplier: 1.2
	});

document.addEventListener("mousemove", (e) => {

    const now = Date.now();

    // ограничение частоты следов
    if (now - lastTime < 120) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // игнор мелких движений
    if (distance < 18) return;

    lastTime = now;

    // элемент под курсором
    const el = document.elementFromPoint(e.clientX, e.clientY);

    const isDarkZone = el?.closest(".header, .footer");

    // создаём контейнер лапки
    const paw = document.createElement("div");
    paw.className = "paw-print";

    const pawInner = document.createElement("div");
    pawInner.className = "paw-inner";

    // угол движения
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // лёгкая случайность
    const randomAngle = Math.random() * 10 - 5;

    // выбор изображения
    let pawImage;

    if (isDarkZone) {
        pawImage = leftFoot ? PAW_LEFT_DARK : PAW_RIGHT_DARK;
    } else {
        pawImage = leftFoot ? PAW_LEFT_LIGHT : PAW_RIGHT_LIGHT;
    }

    pawInner.style.backgroundImage = `url(${pawImage})`;

    // поворот + небольшой разброс
    pawInner.style.transform =
        `rotate(${angle + 90 + randomAngle}deg)`;

    // расстояние между лапками
    const offset = leftFoot ? -22 : 22;

    const rad = (angle + 90) * Math.PI / 180;

    const offsetX = Math.cos(rad) * offset;
    const offsetY = Math.sin(rad) * offset;

    // позиция лапки
    paw.style.left = `${e.clientX + offsetX - 12}px`;
    paw.style.top = `${e.clientY + offsetY - 12}px`;

    paw.appendChild(pawInner);
    document.body.appendChild(paw);

    // удаление
    setTimeout(() => {
        paw.remove();
    }, 3000);

    leftFoot = !leftFoot;

    lastX = e.clientX;
    lastY = e.clientY;
});




let unlocked = false;
let scrollLocked = false;


document.addEventListener("DOMContentLoaded", () => {

    const isMobile = window.innerWidth <= 480;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const card = document.getElementById("heroCard");
    const heroImage = document.getElementById("cardImage");

    const btnLeft = document.getElementById("swipeLeft");
    const btnRight = document.getElementById("swipeRight");

    const penguin = document.getElementById("heroPenguin");
    const hero = document.querySelector(".hero");

    if (!card || !heroImage || !btnLeft || !btnRight || !penguin || !hero) {
        console.log("Не найдены элементы hero");
        return;
    }

    const heroCards = [
        "images/card_1.png",
        "images/card_2.png",
        "images/card_3.png"
    ];

    let heroCurrent = 0;

    const lockPoint =
        hero.offsetTop +
        hero.offsetHeight * 0.15;

    let heroTriggered = false;

    if (!isMobile) {

        lenis.on("scroll", ({ scroll }) => {

            if (heroTriggered || scrollLocked) return;

            if (scroll >= lockPoint) {

				heroTriggered = true;
				scrollLocked = true;

				lenis.stop();

				penguin.classList.add("hidden");

				setTimeout(() => {
					card.classList.add("active");
					unlocked = true;
				}, 500);

				setTimeout(() => {

					scrollLocked = false;
					lenis.start();

				}, 1400);
			}
        });

    } else {

        unlocked = true;
    }

    function changeHeroCard(direction) {

        card.classList.add(
            direction === "right"
                ? "swipe-right"
                : "swipe-left"
        );

        setTimeout(() => {

            if (direction === "right") {
                heroCurrent =
                    (heroCurrent + 1) % heroCards.length;
            } else {
                heroCurrent =
                    (heroCurrent - 1 + heroCards.length) %
                    heroCards.length;
            }

            heroImage.src = heroCards[heroCurrent];

            card.classList.remove(
                "swipe-right",
                "swipe-left"
            );

        }, 350);
    }

    btnLeft.addEventListener("click", () => {
        if (unlocked) changeHeroCard("left");
    });

    btnRight.addEventListener("click", () => {
        if (unlocked) changeHeroCard("right");
    });

});




const about = document.getElementById("about");
const aboutCards = document.querySelectorAll(".about-card");

const isMobile = window.innerWidth <= 480;

if (!isMobile) {

	let activeIndex = 0;
	let aboutFinished = false;
	let aboutAnimating = false;
	let aboutLocked = false;

	function setActiveCard(index) {

		aboutCards.forEach(card => {
			card.classList.remove("active");
		});

		aboutCards[index].classList.add("active");
	}

	setActiveCard(0);

	let aboutStart = 0;

	function updateAboutStart() {
		const stopAt = window.innerHeight * 0.07;

		aboutStart = about.offsetTop - stopAt;
	}

	updateAboutStart();

	window.addEventListener("resize", updateAboutStart);

	lenis.on("scroll", ({ scroll }) => {

		if (aboutFinished || aboutAnimating || aboutLocked) return;

		if (scroll >= aboutStart) {

			aboutLocked = true;

			lenis.stop();
		}
	});

	window.addEventListener(
		"wheel",
		(e) => {

			if (!aboutLocked || aboutAnimating) return;

			e.preventDefault();

			if (e.deltaY > 0 && activeIndex < aboutCards.length - 1) {

				aboutAnimating = true;

				activeIndex++;
				setActiveCard(activeIndex);

				setTimeout(() => {
					aboutAnimating = false;
				}, 600);

				return;
			}

			if (e.deltaY < 0 && activeIndex > 0) {

				aboutAnimating = true;

				activeIndex--;
				setActiveCard(activeIndex);

				setTimeout(() => {
					aboutAnimating = false;
				}, 600);

				return;
			}

			if (e.deltaY > 0 && activeIndex === aboutCards.length - 1) {

				aboutFinished = true;
				aboutLocked = false;

				lenis.start();
			}

			if (e.deltaY < 0 && activeIndex === 0) {

				aboutLocked = false;

				lenis.start();
			}
		},
		{ passive: false }
	);
}


const aboutData = [
    {
        tag: "обмен",
        text: "ДАРИ — ПЛАТФОРМА ДЛЯ ОБМЕНА ВЕЩАМИ БЕЗ ДЕНЕГ",
        image: "images/about_1.jpg",
        color: "#FDD47A"
    },
    {
        tag: "эко",
        text: "ПЕРЕДАВАЙ ВЕЩИ ДАЛЬШЕ И ДАРИ ИМ НОВУЮ ЖИЗНЬ",
        image: "images/about_2.jpg",
        color: "#FFD76A"
    },
    {
        tag: "ИИ",
        text: "ИИ-ПОМОЩНИК СОБЕРЁТ ОБРАЗ И ПОДБЕРЁТ ВЕЩИ",
        image: "images/about_3.jpg",
        color: "#F8C44B"
    },
    {
        tag: "рядом",
        text: "ОБМЕНИВАЙСЯ ВЕЩАМИ С ЛЮДЬМИ ПОБЛИЗОСТИ",
        image: "images/about_4.jpg",
        color: "#FF8A00"
    }
];


aboutCards.forEach((card, index) => {

    const image = document.createElement("img");

    image.classList.add("about-card-image");

    image.src = aboutData[index].image;
    image.alt = aboutData[index].tag;

    card.prepend(image);
});



const slide = document.querySelector(".about-slide");
const aboutImage = document.querySelector(".about-slide-image");

const tag = document.querySelector(".about-slide-tag");
const text = document.querySelector(".about-slide-content h3");

const prev = document.querySelector(".about-prev");
const next = document.querySelector(".about-next");

let aboutCurrent = 0;

function renderSlide(index) {

    const item = aboutData[index];

    aboutImage.src = item.image;
    tag.textContent = item.tag;
    text.textContent = item.text;

    slide.style.background = item.color;
}

function changeAboutSlide(direction) {

    slide.classList.add(
        direction === "next"
            ? "swipe-right"
            : "swipe-left"
    );

    setTimeout(() => {

        if (direction === "next") {

            aboutCurrent =
                (aboutCurrent + 1) % aboutData.length;

        } else {

            aboutCurrent =
                (aboutCurrent - 1 + aboutData.length) %
                aboutData.length;
        }

        renderSlide(aboutCurrent);

        slide.classList.remove(
            "swipe-right",
            "swipe-left"
        );

    }, 300);
}

renderSlide(aboutCurrent);

next.addEventListener("click", () => {
    changeAboutSlide("next");
});

prev.addEventListener("click", () => {
    changeAboutSlide("prev");
});

let startX = 0;

slide.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

slide.addEventListener("touchend", (e) => {

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
        changeAboutSlide("next");
    } else {
        changeAboutSlide("prev");
    }
});






const worksSlider = document.querySelector(".works-slider");
const worksTrack = document.querySelector(".works-track");

const gap = 12;

const visibleCards = 3;

const originalCards = [...worksTrack.children];

originalCards.forEach(card => {
    worksTrack.appendChild(card.cloneNode(true));
});

originalCards.forEach(card => {
    worksTrack.appendChild(card.cloneNode(true));
});

let currentIndex = originalCards.length;
let centerOffset = 0;
let isAnimating = false;

updatePosition();

function getCardWidth() {
    return worksTrack.querySelector(".works-card").offsetWidth;
}

function updatePosition() {

    const cardWidth = getCardWidth();

    const visibleCards = getVisibleCards();

    const visibleWidth =
        cardWidth * visibleCards +
        gap * (visibleCards - 1);

    centerOffset =
        (worksSlider.offsetWidth - visibleWidth) / 2;

    const step = cardWidth + gap;

    worksTrack.style.transition = "none";

    worksTrack.style.transform =
        `translateX(${centerOffset - currentIndex * step}px)`;
}

window.addEventListener("load", updatePosition);
window.addEventListener("resize", updatePosition);

function moveWorks() {

    if (isAnimating) return;

    isAnimating = true;

    const step = getCardWidth() + gap;

    currentIndex++;

    worksTrack.style.transition = "transform .6s ease";

    worksTrack.style.transform =
        `translateX(${centerOffset - currentIndex * step}px)`;

    if (currentIndex >= originalCards.length * 2) {

    setTimeout(() => {

        worksTrack.style.transition = "none";

        currentIndex = originalCards.length;

        worksTrack.style.transform =
            `translateX(${centerOffset - currentIndex * step}px)`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                worksTrack.style.transition =
                    "transform .6s ease";
            });
        });

    }, 600);
}

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

updatePosition();

setInterval(moveWorks, 4000);

function getVisibleCards() {
    return window.innerWidth <= 375 ? 1
         : window.innerWidth <= 1194 ? 2
         : 3;
}




const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    (entries, observer) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
        });
    },

    {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
    }
);

revealElements.forEach(el => {
    revealObserver.observe(el);
});



const fields = document.querySelectorAll(
    ".contact-field input, .contact-field textarea"
);

fields.forEach(field => {

    const defaultPlaceholder = field.placeholder;
    const activePlaceholder = field.dataset.placeholder;

    field.addEventListener("focus", () => {
        field.placeholder = activePlaceholder;
    });

    field.addEventListener("blur", () => {
        field.placeholder = defaultPlaceholder;
    });

});