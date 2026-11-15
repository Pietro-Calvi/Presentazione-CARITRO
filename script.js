document.addEventListener('DOMContentLoaded', () => {
                const navbar = document.querySelector('.custom-navbar');
                const sectionsWithTabs = [];

                document.querySelectorAll('.area-section').forEach(section => {
                    const tabsEl = section.querySelector('.big-topic-tabs');
                    const tabContent = section.querySelector('.tab-content');
                    if (!tabsEl || !tabContent) return;

                    const topSlot = document.createElement('div');
                    topSlot.className = 'tabs-top-slot';
                    tabsEl.parentNode.insertBefore(topSlot, tabsEl);
                    topSlot.appendChild(tabsEl);

                    const bottomSlot = document.createElement('div');
                    bottomSlot.className = 'tabs-bottom-slot';
                    tabContent.insertAdjacentElement('afterend', bottomSlot);

                    sectionsWithTabs.push({ section, tabsEl, topSlot, bottomSlot, isAtBottom: false });
                });

                function updateTabsPlacement() {
                    const navHeight = navbar ? navbar.offsetHeight : 65;

                    sectionsWithTabs.forEach(item => {
                        const topSlotBottom = item.topSlot.getBoundingClientRect().bottom;

                        if (!item.isAtBottom && topSlotBottom <= navHeight) {
                            item.topSlot.style.minHeight = item.topSlot.offsetHeight + 'px';
                            item.bottomSlot.appendChild(item.tabsEl);
                            item.isAtBottom = true;
                        } else if (item.isAtBottom && topSlotBottom > navHeight + 12) {
                            item.topSlot.appendChild(item.tabsEl);
                            item.topSlot.style.minHeight = '';
                            item.isAtBottom = false;
                        }
                    });
                }

                window.addEventListener('scroll', updateTabsPlacement, { passive: true });
                window.addEventListener('resize', updateTabsPlacement);
                updateTabsPlacement();

                function pauseAllVideos() {
                    document.querySelectorAll('video').forEach(video => video.pause());
                }

                function playVideosIn(container) {
                    if (!container) return;
                    container.querySelectorAll('video').forEach(video => {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {
                                video.muted = true;
                                video.play();
                            });
                        }
                    });
                }

                document.addEventListener('slide.bs.carousel', pauseAllVideos);
                document.addEventListener('slid.bs.carousel', event => {
                    playVideosIn(event.relatedTarget);
                });

                document.querySelectorAll('.big-topic-tabs button[data-bs-toggle="pill"]').forEach(btn => {
                    btn.addEventListener('shown.bs.tab', event => {
                        pauseAllVideos();

                        const targetSelector = event.target.getAttribute('data-bs-target');
                        const targetPane = targetSelector ? document.querySelector(targetSelector) : null;
                        if (targetPane) {
                            const activeSlide = targetPane.querySelector('.carousel-item.active') || targetPane;
                            playVideosIn(activeSlide);
                        }

                        const section = btn.closest('.area-section');
                        const item = sectionsWithTabs.find(s => s.section === section);

                        if (item && item.isAtBottom) {
                            const navHeight = navbar ? navbar.offsetHeight : 65;
                            const targetTop = section.getBoundingClientRect().top + window.scrollY - navHeight - 12;
                            window.scrollTo({ top: targetTop, behavior: 'smooth' });
                        }
                    });
                });
            });