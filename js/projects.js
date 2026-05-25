/* =========================
   LIVE CLOCK
========================= */

function updateClock(){

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    const ampm =
    hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    hours = hours ? hours : 12;

    minutes =
    minutes < 10
    ? '0' + minutes
    : minutes;

    const currentTime =
    `${hours}:${minutes} ${ampm}`;

    document
    .getElementById('clock')
    .textContent = currentTime;
}



/* START CLOCK */

updateClock();

setInterval(updateClock, 60000);





/* =========================
   NAVBAR INTERACTIONS
========================= */

const navLinks =
document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {

    link.addEventListener('mouseenter', () => {

        if(
            !link.classList.contains('active-nav')
        ){

            link.style.translate =
'0 -2px';

        }

    });




    link.addEventListener('mouseleave', () => {

        link.style.translate =
'0 0';

    });

});



/* =========================
   SMOOTH SCROLL
========================= */

document.documentElement.style.scrollBehavior =
'smooth';



/* =========================
   LIQUID NAV SLIDER
========================= */

const navContainer =
document.querySelector('.nav-links');

const activeLink =
document.querySelector('.active-nav');

if(navContainer && activeLink){

    const slider =
    document.createElement('div');

    slider.classList.add('nav-slider');

    navContainer.appendChild(slider);

    function moveSlider(target){

        slider.style.width =
        `${target.offsetWidth}px`;

        slider.style.transform =
        `translate3d(${target.offsetLeft}px,0,0)`;

    }

    moveSlider(activeLink);

    document
    .querySelectorAll('.nav-links a')
    .forEach(link=>{

        link.addEventListener(
        'mouseenter',
        ()=>{

            moveSlider(link);

        });

    });

    navContainer.addEventListener(
    'mouseleave',
    ()=>{

        moveSlider(activeLink);

    });

}


/* =========================
   CURSOR BUBBLES
========================= */

let bubbleCount = 0;

document.addEventListener(
'mousemove',
(e)=>{

    bubbleCount++;

    if(bubbleCount % 20 !== 0) return;

    const bubble =
    document.createElement('div');

    bubble.classList.add('bubble');

    bubble.style.left =
    `${e.clientX}px`;

    bubble.style.top =
    `${e.clientY}px`;

    document.body.appendChild(
    bubble
    );

    setTimeout(()=>{

        bubble.remove();

    },800);

});

const themeToggle =
document.getElementById('themeToggle');

/* DEFAULT DARK MODE */

if(localStorage.getItem('theme') === null){

    localStorage.setItem(
    'theme',
    'dark'
    );

}

if(
localStorage.getItem('theme')
=== 'dark'
){

    document.body.classList.add(
    'dark-mode'
    );

    if(themeToggle){
        themeToggle.textContent='☀️';
    }

}
else{

    if(themeToggle){
        themeToggle.textContent='🌙';
    }

}

if(themeToggle){

    themeToggle.addEventListener(
    'click',
    ()=>{

        document.body.classList.toggle(
        'dark-mode'
        );

        const dark =
        document.body.classList.contains(
        'dark-mode'
        );

        localStorage.setItem(
        'theme',
        dark ? 'dark' : 'light'
        );

        themeToggle.textContent =
        dark ? '☀️' : '🌙';

    });

}