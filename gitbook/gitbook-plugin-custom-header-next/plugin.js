require(["gitbook", "jQuery"], function (gitbook, $) {
    let configs = null
    gitbook.events.bind('page.change', function (e, config) {
        configs = gitbook.state.config.pluginsConfig['custom-header-next'] || {}
        configs && initHeader(configs)
    });

    function initHeader(_configs) {
        let $head = '<header id="main"><div class="inner">';
        let $head_small = '<header id="small"><div class="swiper-container">';

        $head += `
            <a href="${_configs['base_path']}" title="${_configs['logo_alt']}" class="logo">
            `;
        if (_configs.logo) {
          $head += `
                    <img src="${_configs.logo}"/>`;
        }
        if (_configs.text) {
          $head += `
                    <span>${_configs.text}</span>`;
        }
        $head += `
            </a>
        `;
        let activeIndex = 0
        if (_configs.navigations && _configs.navigations.length > 0) {//添加导航
            $head += '<div class="header_ctrls"><ul class="top_nav">'
            $head_small += '<div class="swiper-wrapper">'
            let isSelected = ''
            const curPath = window.location.href
            var _len = _configs.navigations.length
            for (let i = 0; i < _len; i++) {
                let _item = _configs.navigations[i]
                _item.current = _item.current || false
                isSelected = _item.current ? 'selected' : ''
                if (isSelected) {
                    activeIndex = i
                }
                $head += `
                    <li class="top_nav_item ${isSelected}" id="${_item.id}">
                        <a href="${_item.link}">${_item.title}</a>
                    </li>
                `
                $head_small += `
                    <div class="swiper-slide ${isSelected}" id="${_item.id}_small">
                        <a href="${_item.link}">${_item.title}</a>
                    </div>`
            }
            $head += '<ul></div>';
            $head_small += '</div>';
        }
        $head += '</div></header>';
        $head_small += '</div></header>';
        $('.book').addClass('with-header').prepend($head)
        $('.book').prepend($head_small)

        const isCenterMode = activeIndex == 0 || (activeIndex + 1) == _len ? false : true
        var mySwiper = new Swiper('.swiper-container', {
            initialSlide: activeIndex,
            centeredSlides: true,
            slidesPerView: 3,
            freeMode: true,
            centeredSlides: isCenterMode
        })
    }
});
