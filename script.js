const courses = [
    {
        id: 1,
        title: "The Ultimate Google Ads Training Course",
        category: "marketing",
        price: "$100",
        author: "Jerome Bell",
        image: "images/course1.png"
    },
    {
        id: 2,
        title: "Product Management Fundamentals",
        category: "management",
        price: "$480",
        author: "Marvin McKinney",
        image: "images/course2.png"
    },
    {
        id: 3,
        title: "HR Management and Analytics",
        category: "hr",
        price: "$200",
        author: "Leslie Alexander Li",
        image: "images/course3.png"
    },
    {
        id: 4,
        title: "Brand Management & PR Communications",
        category: "marketing",
        price: "$530",
        author: "Kristin Watson",
        image: "images/course4.png"
    },
    {
        id: 5,
        title: "Graphic Design Basic",
        category: "design",
        price: "$500",
        author: "Guy Hawkins",
        image: "images/course5.png"
    },
    {
        id: 6,
        title: "Business Development Management",
        category: "management",
        price: "$400",
        author: "Dianne Russell",
        image: "images/course6.png"
    },
    {
        id: 7,
        title: "Highload Software Architecture",
        category: "development",
        price: "$600",
        author: "Brooklyn Simmons",
        image: "images/course7.png"
    },
    {
        id: 8,
        title: "Human Resources – Selection and Recruitment",
        category: "hr",
        price: "$150",
        author: "Kathryn Murphy",
        image: "images/course8.png"
    },
    {
        id: 9,
        title: "User Experience. Human-centered Design",
        category: "design",
        price: "$240",
        author: "Cody Fisher",
        image: "images/course9.png"
    },
    {
        id: 10,
        title: "Advanced Marketing Strategies",
        category: "marketing",
        price: "$320",
        author: "Jane Cooper",
        image: "images/course1.png"
    },
    {
        id: 11,
        title: "Leadership and Team Management",
        category: "management",
        price: "$450",
        author: "Robert Fox",
        image: "images/course2.png"
    },
    {
        id: 12,
        title: "UX/UI Design Fundamentals",
        category: "design",
        price: "$280",
        author: "Esther Howard",
        image: "images/course5.png"
    }
];

// Состояние приложения
const state = {
    currentCategory: 'all',
    searchQuery: '',
    visibleCourses: 9
};

// DOM элементы
const elements = {
    tabs: document.querySelector('.tabs'),
    searchInput: document.querySelector('.search__input'),
    coursesGrid: document.querySelector('.courses-grid'),
    loadMoreBtn: document.querySelector('.load-more'),
    allCount: document.getElementById('all-count')
};

// Подсчет карточек по категориям
function countCoursesByCategory() {
    const counts = {
        all: courses.length,
        marketing: courses.filter(c => c.category === 'marketing').length,
        management: courses.filter(c => c.category === 'management').length,
        hr: courses.filter(c => c.category === 'hr').length,
        design: courses.filter(c => c.category === 'design').length,
        development: courses.filter(c => c.category === 'development').length
    };
    return counts;
}

// Обновление цифр в кнопках фильтров
function updateFilterCounts() {
    const counts = countCoursesByCategory();
    
    if (elements.allCount) {
        elements.allCount.textContent = counts.all;
    }
    
    document.querySelectorAll('.tab').forEach(tab => {
        const category = tab.dataset.category;
        const countEl = tab.querySelector('.tab__count');
        if (category !== 'all' && counts[category] !== undefined && countEl) {
            countEl.textContent = counts[category];
        }
    });
}

// Фильтрация курсов
function filterCourses() {
    return courses.filter(course => {
        const categoryMatch = state.currentCategory === 'all' || 
                            course.category === state.currentCategory;
        
        const searchMatch = !state.searchQuery || 
                           course.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        return categoryMatch && searchMatch;
    });
}

// Получение имени категории
function getCategoryName(categoryKey) {
    const names = {
        marketing: 'Marketing',
        management: 'Management',
        hr: 'HR & Recruiting',
        design: 'Design',
        development: 'Development'
    };
    return names[categoryKey] || categoryKey;
}

// Рендер карточек
function renderCourses() {
    const filteredCourses = filterCourses();
    const coursesToShow = filteredCourses.slice(0, state.visibleCourses);
    
    if (!elements.coursesGrid) return;
    
    elements.coursesGrid.innerHTML = '';
    
    if (coursesToShow.length === 0) {
        elements.coursesGrid.innerHTML = `
            <div class="no-results">
                <p>No courses found. Try a different search or filter.</p>
            </div>
        `;
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.style.display = 'none';
        }
        return;
    }
    
    coursesToShow.forEach(course => {
        const card = document.createElement('article');
        card.className = 'course-card';
        card.dataset.category = course.category;
        card.dataset.id = course.id;
        
        card.innerHTML = `
            <div class="course-card__image">
                <img src="${course.image}" alt="${course.title}" loading="lazy">
            </div>
            <div class="course-card__content">
                <div class="course-card__badge course-card__badge--${course.category}">
                    ${getCategoryName(course.category)}
                </div>
                <h3 class="course-card__title">
                    ${course.title}
                </h3>
                <div class="course-card__info">
                    <div class="course-card__price">${course.price}</div>
                    <div class="course-card__divider"></div>
                    <div class="course-card__speaker">by ${course.author}</div>
                </div>
            </div>
        `;
        
        elements.coursesGrid.appendChild(card);
    });
    
    // Показываем/скрываем кнопку Load more
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.style.display = 
            state.visibleCourses < filteredCourses.length ? 'flex' : 'none';
    }
}

// Обработка кликов по фильтрам
function handleFilterClick(e) {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    
    const category = tab.dataset.category;
    
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('tab--active');
    });
    tab.classList.add('tab--active');
    
    state.currentCategory = category;
    state.visibleCourses = 9;
    renderCourses();
}

// Обработка поиска с debounce
let searchTimeout;
function handleSearch(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value;
        state.visibleCourses = 9;
        renderCourses();
    }, 300);
}

// Обработка Load more
function handleLoadMore() {
    state.visibleCourses += 6;
    renderCourses();
}

// Назначение обработчиков событий
function setupEventListeners() {
    if (elements.tabs) {
        elements.tabs.addEventListener('click', handleFilterClick);
    }
    
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }
    
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// Инициализация
function init() {
    updateFilterCounts();
    renderCourses();
    setupEventListeners();
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', init);