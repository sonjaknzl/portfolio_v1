gsap.registerPlugin(ScrollTrigger);

const $html = jQuery("html, body");
const $container = $("#container");
const $banner = $(".banner");
const $bannerInner = $(".banner-inner");
const $marqueeInner = $(".marquee-inner");
const $container4 = $("#container4");

$html.css("overflow-x", "hidden");

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// background video header
let tl = gsap.timeline();
tl.to($container, {
  scrollTrigger: {
    trigger: $container,
    scrub: true,
    start: "top top",
    pin: true,
    end: "bottom center",
  },
  opacity: 0,
});

// opacity banner
let tl1 = gsap.timeline({
  scrollTrigger: {
    trigger: $banner,
    start: "top top",
    scrub: $banner,
    // markers: true,
  },
});
tl1.from($bannerInner, {
  opacity: 0,
});
tl1.to($bannerInner, {
  opacity: 1,
});

// opacity banner
let tl4 = gsap.timeline({
  scrollTrigger: {
    trigger: "#container2helper",
    start: "center top",
    endTrigger: "#divider",
    end: "20% top",
    scrub: $banner,
    onRefresh: () => tl1.pause(),
  },
});

tl4.to($bannerInner, {
  opacity: 0,
});

let tl2 = gsap.timeline();
tl2.to($marqueeInner, {
  duration: 15,
  xPercent: 25,
  ease: "linear",
  repeat: -1,
});

// marquee banner
ScrollTrigger.create({
  trigger: $banner,
  start: "top top",
  endTrigger: "#divider",
  end: "bottom top",
  pin: $banner,
  onRefresh: () => tl2.resume(),
  onEnter: () => tl2.play(),
  onLeave: () => tl2.pause(),
  onEnterBack: () => tl2.resume(),
  onLeaveBack: () => tl2.pause(),
});

// background video footer
gsap.to($container4, {
  scrollTrigger: {
    trigger: $container4,
    scrub: true,
    start: "top top",
    pin: true,
  },
  opacity: 1,
});
