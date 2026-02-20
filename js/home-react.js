(function () {
  if (!window.React || !window.ReactDOM) {
    return;
  }

  var e = React.createElement;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useState = React.useState;

  function FloatingOrb(props) {
    return e('div', {
      className: 'floating-orb ' + props.className,
      style: { transform: 'translateY(' + props.offset + 'px)' }
    });
  }

  function RegionCard(props) {
    return e('a', { className: 'region-card', href: props.href, target: props.external ? '_blank' : undefined },
      e('h3', null, props.name),
      e('p', null, props.text)
    );
  }

  function SlideMarker(props) {
    return e('button', {
      className: 'slide-marker' + (props.active ? ' active' : ''),
      onClick: props.onClick,
      'aria-label': 'Go to slide ' + (props.index + 1)
    }, e('span', null, String(props.index + 1).padStart(2, '0')));
  }

  function HomeApp() {
    var _a = useState(0), scrollY = _a[0], setScrollY = _a[1];
    var _b = useState(0), activeSlide = _b[0], setActiveSlide = _b[1];
    var slideDuration = 6;
    var _c = useState(slideDuration), secondsLeft = _c[0], setSecondsLeft = _c[1];

    useEffect(function () {
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          setScrollY(window.scrollY || 0);
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);

    var creatures = useMemo(function () {
      return [
        { src: 'https://assets.tamigucho.com/assets/cms2/img/tamipedia/full/001.png', alt: 'Tamigucho creature 001' },
        { src: 'https://factory.tamigucho.com/classic/img/creatures/2013/Firember.png', alt: 'Firember creature' },
        { src: 'https://assets.tamigucho.com/assets/cms2/img/tamipedia/full/007.png', alt: 'Tamigucho creature 007' }
      ];
    }, []);

    var slides = useMemo(function () {
      return [
        {
          title: 'Rise of Tamigucho multiverse',
          text: 'Do lore clássico até hubs experimentais. Uma franquia que trata criaturas como cultura pop viva.',
          image: 'https://assets.tamigucho.com/assets/cms2/img/tamipedia/full/001.png'
        },
        {
          title: 'DAO energy sem estética preguiçosa',
          text: 'Web3 só vale quando vira utilidade. Aqui o visual puxa a comunidade pra participar de verdade.',
          image: './img/5d30129fbe8118efde2a8a25_Badge Dark.svg'
        },
        {
          title: 'Cards, collabs e timeline viva',
          text: 'Cada seção abre novas entradas no universo. Menos landing morta, mais mundo navegável.',
          image: './tamipedia/img/IMG_20220629_185301_e~2.png'
        }
      ];
    }, []);

    var regions = [
      { name: 'Tamipedia', text: 'Lore, criaturas, tipos e tudo que expande o universo.', href: './tamipedia' },
      { name: 'Cards', text: 'Coleções e artes oficiais pra quem curte a estética moncatching.', href: './cards' },
      { name: 'Pink & Dark', text: 'Dualidade clássica da franquia em vibe retrô/arcade.', href: 'https://pinkdark.tamigucho.com/', external: true },
      { name: 'Sunny & Rainny', text: 'Edição climática com identidade forte e contraste visual.', href: 'https://sunnyrainny.tamigucho.com/', external: true }
    ];

    useEffect(function () {
      // Slideshow timer: counts down each second and loops to next slide.
      var id = window.setInterval(function () {
        setSecondsLeft(function (current) {
          if (current <= 1) {
            setActiveSlide(function (prev) {
              return (prev + 1) % slides.length;
            });
            return slideDuration;
          }
          return current - 1;
        });
      }, 1000);

      return function () {
        window.clearInterval(id);
      };
    }, [slides.length]);

    function goToSlide(index) {
      setActiveSlide(index);
      setSecondsLeft(slideDuration);
    }

    var currentSlide = slides[activeSlide];

    return e('section', { className: 'anime-react-home' },
      e(FloatingOrb, { className: 'orb-a', offset: scrollY * -0.08 }),
      e(FloatingOrb, { className: 'orb-b', offset: scrollY * -0.12 }),
      e(FloatingOrb, { className: 'orb-c', offset: scrollY * -0.05 }),

      e('section', { className: 'top-slideshow' },
        e('div', { className: 'slideshow-main' },
          e('div', { className: 'slideshow-copy' },
            e('p', { className: 'hero-tag' }, 'Featured storyline sequence'),
            e('h2', null, currentSlide.title),
            e('p', null, currentSlide.text),
            e('div', { className: 'slide-countdown' },
              e('strong', null, secondsLeft + 's'),
              e('span', null, ' para próxima transição')
            )
          ),
          e('div', { className: 'slideshow-media' },
            e('img', { src: currentSlide.image, alt: currentSlide.title })
          )
        ),
        e('div', { className: 'slide-markers' }, slides.map(function (_, index) {
          return e(SlideMarker, {
            key: 'marker-' + index,
            index: index,
            active: index === activeSlide,
            onClick: function () { goToSlide(index); }
          });
        }))
      ),

      e('div', { className: 'hero-landscape' },
        e('div', { className: 'hero-copy', style: { transform: 'translateY(' + (scrollY * -0.03) + 'px)' } },
          e('p', { className: 'hero-tag' }, 'Virtual pets + lore + caos criativo'),
          e('h1', null, 'Tamigucho Universe, agora em modo anime landscape'),
          e('p', null, 'Mais camadas visuais, mais profundidade, mais rolê de franquia viva. Sem cara de landing genérica Web2 Jesules.'),
          e('div', { className: 'anime-hex-actions' },
            e('a', { href: './tamipedia', className: 'anime-pill' }, 'Explore creatures'),
            e('a', { href: './cards', className: 'anime-pill alt' }, 'Open cards')
          )
        ),
        e('div', { className: 'hero-panel', style: { transform: 'translateY(' + (scrollY * -0.05) + 'px)' } },
          e('div', { className: 'anime-badge-row' }, creatures.map(function (c) {
            return e('img', { key: c.src, src: c.src, alt: c.alt, width: '150' });
          })),
          e('img', { className: 'anime-logo', src: 'logotype.png', alt: 'Tamigucho logotype', width: '514' })
        )
      ),

      e('div', { className: 'landscape-strip' },
        e('article', { className: 'anime-story-card' },
          e('img', { src: './tamipedia/img/IMG_20220629_185301_e~2.png', alt: 'Tamigucho anime style key art' }),
          e('p', null, 'Anime background not original: re-used.'),
          e('p', null, 'Creations by ', e('a', { href: 'https://danimesq.github.io/', target: '_blank' }, 'Daniella Mesquita'), '. Drawings by ', e('a', { href: 'https://www.instagram.com/dultrart/', target: '_blank' }, 'Adriano Dultra'), '.')
        ),
        e('article', { className: 'feature-block' },
          e('h2', null, 'Parallax, hover, onscroll e aquela dramaticidade de opening de anime.'),
          e('p', null, 'A home agora tem camadas reagindo ao scroll e cards com foco em navegação longa. É o tipo de começo que enche linguiça sim, mas enche com estilo e intenção.'),
          e('p', null, 'Nos bastidores: React em runtime, sem pipeline pesado, mantendo compatibilidade com a estrutura atual.')
        )
      ),

      e('section', { className: 'region-grid' },
        regions.map(function (region) {
          return e(RegionCard, { key: region.name, name: region.name, text: region.text, href: region.href, external: region.external });
        })
      )
    );
  }

  var rootEl = document.getElementById('react-home');
  if (!rootEl) {
    return;
  }

  ReactDOM.createRoot(rootEl).render(e(HomeApp));
})();
