/* Abonnements sans engagement — une seule source pour le gant flottant, les bandes
   in-page et le badge de navigation. URLs boutique officielles uniquement. */
(function () {
    const OFFERS = [
        {
            id: 'etudiant',
            whole: '36',
            exact: '36,99 €',
            kicker: 'Étudiant · sans engagement',
            title: 'Étudiant',
            period: 'toutes les 4 semaines',
            hook: 'Carte étudiante demandée à l’inscription. Même cage, même ring, mêmes cours.',
            cta: 'Je m’inscris en étudiant',
            url: 'https://boutique.boxingcenter.fr/inscription?product=etudiants-4-semaines'
        },
        {
            id: 'adulte',
            whole: '44',
            exact: '44,99 €',
            kicker: 'Adulte · sans engagement',
            title: 'Adulte',
            period: 'toutes les 4 semaines',
            hook: 'Cours illimités, accès libre 6j/7 et les 5 salles. Résiliation sans préavis.',
            cta: 'Je m’inscris',
            url: 'https://boutique.boxingcenter.fr/inscription?product=44-99-4-semaines'
        }
    ];

    /* Le prix se lit 36 et 44 : l'entier en grand, « €99 » en exposant.
       Le lecteur d'écran entend le montant exact. */
    function priceHTML(offer) {
        return '<span class="visually-hidden">' + offer.exact + '</span>' +
            '<i class="px" aria-hidden="true">' + offer.whole + '<sup class="px-c">€99</sup></i>';
    }

    const GLOVE_SRC = (function () {
        var parts = location.pathname.replace(/\/index\.html$/, '/').split('/').filter(Boolean);
        var pages = ['disciplines', 'planning', 'clubs', 'nos-clubs', 'abonnements', 'contact', 'mentions-legales'];
        return pages.indexOf(parts[parts.length - 1]) !== -1
            ? '../photo_salle/hero_gants.webp'
            : 'photo_salle/hero_gants.webp';
    })();
    const ROTATE_MS = 5500;
    const IDLE_DESKTOP = 2400;
    const IDLE_MOBILE = 1300;

    let index = 0;
    const listeners = new Set();
    let rotateTimer = null;

    function current() {
        return OFFERS[index];
    }

    function notify() {
        const offer = current();
        listeners.forEach((fn) => fn(offer, index));
    }

    function subscribe(fn) {
        listeners.add(fn);
        fn(current(), index);
        return () => listeners.delete(fn);
    }

    function startRotation(reduceMotion) {
        if (rotateTimer) window.clearInterval(rotateTimer);
        rotateTimer = window.setInterval(() => {
            index = (index + 1) % OFFERS.length;
            notify();
        }, reduceMotion ? 9000 : ROTATE_MS);
    }

    function pageSlug() {
        let path = window.location.pathname;
        ['/boxing_center_etats_unis', '/boxing_center', '/bc-usa'].forEach((prefix) => {
            if (path === prefix || path.indexOf(prefix + '/') === 0) {
                path = path.slice(prefix.length) || '/';
            }
        });
        path = path.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
        if (path === '/' || path === '/index.html') return 'index';
        return path.split('/').pop().replace(/\.html$/, '');
    }

    function isMobile() {
        return window.matchMedia('(max-width: 992px)').matches;
    }

    function offerLinkAttrs(offer) {
        return `href="${offer.url}" target="_blank" rel="noopener"`;
    }

    window.initOffers = function initOffers(reduceMotion) {
        startRotation(reduceMotion);
        injectStrips();
        initGlove(reduceMotion);
    };

    function stripHTML(variant) {
        return `
            <aside class="offer-strip offer-strip--${variant}" data-offer-strip aria-label="Abonnement sans engagement">
                <div class="container offer-strip-inner">
                    <div class="offer-strip-glove" aria-hidden="true">
                        <img src="${GLOVE_SRC}" alt="" width="80" height="80" decoding="async">
                    </div>
                    <div class="offer-strip-copy">
                        <p class="offer-strip-kicker" data-offer-kicker></p>
                        <p class="offer-strip-title"><strong data-offer-price></strong> <span data-offer-period></span></p>
                        <p class="offer-strip-hook" data-offer-hook></p>
                    </div>
                    <a class="btn btn-primary offer-strip-cta" data-offer-cta target="_blank" rel="noopener">Je m’inscris</a>
                </div>
            </aside>`;
    }

    function bindStrip(root) {
        const price = root.querySelector('[data-offer-price]');
        const period = root.querySelector('[data-offer-period]');
        const hook = root.querySelector('[data-offer-hook]');
        const kicker = root.querySelector('[data-offer-kicker]');
        const cta = root.querySelector('[data-offer-cta]');
        subscribe((offer) => {
            if (price) price.innerHTML = priceHTML(offer);
            if (kicker) kicker.textContent = offer.kicker;
            if (period) period.textContent = offer.period;
            if (hook) hook.textContent = offer.hook;
            if (cta) {
                cta.href = offer.url;
                cta.textContent = offer.cta;
                cta.setAttribute('aria-label', `${offer.cta} : ${offer.exact} toutes les 4 semaines, sans engagement`);
            }
        });
    }

    function injectAfter(el, variant) {
        if (!el) return;
        el.insertAdjacentHTML('afterend', stripHTML(variant));
        const node = el.nextElementSibling;
        if (node && node.hasAttribute('data-offer-strip')) bindStrip(node);
    }

    function injectBefore(el, variant) {
        if (!el) return;
        el.insertAdjacentHTML('beforebegin', stripHTML(variant));
        const node = el.previousElementSibling;
        if (node && node.hasAttribute('data-offer-strip')) bindStrip(node);
    }

    function injectStrips() {
        const file = pageSlug();
        if (file === 'abonnements' || document.body.classList.contains('page-abonnements')) return;

        const hero = document.querySelector('.hero, .page-hero');
        injectAfter(hero, 'hero');

        if (file === 'disciplines') {
            const rows = document.querySelectorAll('.discipline-row');
            if (rows[1]) injectAfter(rows[1], 'mid');
        }

        if (file === 'contact') return;

        const immersive = document.querySelector('.immersive');
        if (immersive) {
            injectBefore(immersive, 'footer');
            return;
        }

        const lastCta = document.querySelector('main > section.section-bg-alt:last-of-type');
        if (lastCta && file === 'disciplines') {
            injectBefore(lastCta, 'footer');
            return;
        }

        const footer = document.querySelector('footer');
        injectBefore(footer, 'footer');
    }

    function initGlove(reduceMotion) {
        if (sessionStorage.getItem('bcOfferGloveClosed') === '1') return;

        const widget = document.createElement('aside');
        widget.className = 'offer-glove';
        widget.setAttribute('aria-label', 'Abonnements sans engagement');
        widget.innerHTML = `
            <button type="button" class="offer-glove-hand" aria-expanded="false" aria-controls="offer-glove-panel">
                <img src="${GLOVE_SRC}" alt="" width="72" height="72" decoding="async">
            </button>
            <div class="offer-glove-panel" id="offer-glove-panel">
                <button type="button" class="offer-glove-close" aria-label="Masquer les offres">&times;</button>
                <p class="offer-glove-kicker">Sans engagement</p>
                <p class="offer-glove-price" data-offer-price></p>
                <p class="offer-glove-meta"><span data-offer-title></span> · <span data-offer-period></span></p>
                <p class="offer-glove-hook" data-offer-hook></p>
                <a class="offer-glove-cta" data-offer-cta target="_blank" rel="noopener">Je m’inscris</a>
            </div>
        `;
        document.body.appendChild(widget);

        const hand = widget.querySelector('.offer-glove-hand');
        const closeBtn = widget.querySelector('.offer-glove-close');
        const priceEl = widget.querySelector('[data-offer-price]');
        const titleEl = widget.querySelector('[data-offer-title]');
        const periodEl = widget.querySelector('[data-offer-period]');
        const hookEl = widget.querySelector('[data-offer-hook]');
        const ctaEl = widget.querySelector('[data-offer-cta]');

        subscribe((offer) => {
            priceEl.innerHTML = priceHTML(offer);
            titleEl.textContent = offer.title;
            periodEl.textContent = offer.period;
            hookEl.textContent = offer.hook;
            ctaEl.href = offer.url;
            ctaEl.textContent = offer.cta;
            ctaEl.setAttribute('aria-label', `${offer.cta} : ${offer.exact} toutes les 4 semaines, sans engagement`);
            widget.dataset.offer = offer.id;
            if (!reduceMotion && widget.classList.contains('is-expanded')) {
                widget.classList.remove('is-swap');
                void widget.offsetWidth;
                widget.classList.add('is-swap');
            }
        });

        let dismissed = false;
        let expanded = false;
        let idleTimer = null;
        let coverPlans = false;
        const onAbonnements = document.body.classList.contains('page-abonnements');

        const idleDelay = () => (isMobile() ? IDLE_MOBILE : IDLE_DESKTOP);

        function setExpanded(next) {
            if (dismissed) return;
            if (onAbonnements) next = false;
            if (coverPlans) next = false;
            expanded = next;
            widget.classList.toggle('is-expanded', next);
            document.body.classList.toggle('offer-glove-open', next);
            hand.setAttribute('aria-expanded', next ? 'true' : 'false');
        }

        function reveal() {
            if (dismissed) return;
            widget.classList.add('is-visible');
        }

        function collapseSoon() {
            window.clearTimeout(idleTimer);
            idleTimer = window.setTimeout(() => setExpanded(false), idleDelay());
        }

        function onScroll() {
            if (dismissed) return;
            if (window.scrollY < 90) {
                setExpanded(false);
                if (window.scrollY < 24) widget.classList.remove('is-visible');
                return;
            }
            reveal();
            if (!onAbonnements && !coverPlans && !isMobile()) {
                setExpanded(true);
                collapseSoon();
            }
        }

        hand.addEventListener('click', () => {
            if (dismissed) return;
            if (!widget.classList.contains('is-visible')) reveal();
            if (onAbonnements) {
                window.open(current().url, '_blank', 'noopener');
                return;
            }
            if (expanded) {
                setExpanded(false);
            } else {
                setExpanded(true);
                collapseSoon();
            }
        });

        closeBtn.addEventListener('click', () => {
            dismissed = true;
            window.clearTimeout(idleTimer);
            widget.classList.remove('is-visible', 'is-expanded');
            document.body.classList.remove('offer-glove-open');
            sessionStorage.setItem('bcOfferGloveClosed', '1');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && expanded) setExpanded(false);
        });

        widget.addEventListener('mouseenter', () => {
            if (!isMobile()) window.clearTimeout(idleTimer);
        });
        widget.addEventListener('mouseleave', () => {
            if (expanded) collapseSoon();
        });

        const plans = document.querySelector('#abonnements, #offres, .home-plans, .plan-grid');
        if (plans && 'IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                coverPlans = entries[0].isIntersecting;
                if (coverPlans) setExpanded(false);
            }, { threshold: 0.15 }).observe(plans);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        if (reduceMotion) {
            window.setTimeout(onScroll, 0);
        } else {
            window.setTimeout(onScroll, 400);
        }
    }
})();
