// 动效由 Motion（https://motion.dev）驱动，构建产物已内置在 vendor/motion.js。
// 所有动画都是"先把起点写成内联样式，再动到终点"：Motion 没加载、
// 或用户要求减少动效时，页面保持默认的可见状态，不会被动画藏住。
(function () {
    "use strict";

    var Motion = window.Motion;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canAnimate = Boolean(Motion) && !reduce;
    var ease = [0.22, 1, 0.36, 1];

    function stashStart(elements, offset) {
        elements.forEach(function (element) {
            element.style.opacity = "0";
            element.style.transform = "translateY(" + offset + "px)";
        });
    }

    // ---------- 首屏：依次进场 ----------
    if (canAnimate) {
        var heroChildren = Array.prototype.slice.call(document.querySelectorAll(".hero > *"));
        stashStart(heroChildren, 16);
        Motion.animate(
            heroChildren,
            { opacity: 1, y: 0 },
            { delay: Motion.stagger(0.07), duration: 0.5, ease: ease }
        );
    }

    // ---------- 区块滚动进场：整组依次浮起 ----------
    if (canAnimate) {
        Array.prototype.forEach.call(
            document.querySelectorAll("[data-reveal]"),
            function (group) {
                var items = Array.prototype.slice.call(group.children);
                stashStart(items, 18);
                Motion.inView(
                    group,
                    function () {
                        Motion.animate(
                            items,
                            { opacity: 1, y: 0 },
                            { delay: Motion.stagger(0.06), duration: 0.5, ease: ease }
                        );
                    },
                    { amount: 0.25 }
                );
            }
        );
    }

    // ---------- 顶部滚动进度：交给 Motion 的 scroll 驱动 ----------
    // 必须等 load 之后再建：DOM 解析完就建的话，此时还没布局，
    // 可滚动高度量出来是 0，进度会直接卡在 1。
    window.addEventListener("load", function () {
        if (!canAnimate) return;
        Motion.scroll(
            Motion.animate("#progress-bar", { scaleX: [0, 1] }, { ease: "linear" })
        );
    });

    // ---------- 中英切换 ----------
    var currentLang = "zh";
    var langBtn = document.getElementById("lang-toggle");

    function swapText(target, next) {
        var text = target.getAttribute("data-" + next);
        if (text !== null) target.textContent = text;
    }

    if (langBtn) {
        langBtn.addEventListener("click", function () {
            currentLang = currentLang === "zh" ? "en" : "zh";
            var targets = Array.prototype.slice.call(
                document.querySelectorAll("[data-zh][data-en]")
            );
            document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
            langBtn.textContent = currentLang === "zh" ? "EN" : "中";

            if (!canAnimate) {
                targets.forEach(function (element) {
                    swapText(element, currentLang);
                });
                return;
            }
            // 先淡出、换文字、再淡入，避免整页文字同时跳变
            Motion.animate(
                targets,
                { opacity: 0 },
                {
                    duration: 0.12,
                    onComplete: function () {
                        targets.forEach(function (element) {
                            swapText(element, currentLang);
                        });
                        Motion.animate(targets, { opacity: 1 }, { duration: 0.18, ease: ease });
                    },
                }
            );
        });
    }
})();
