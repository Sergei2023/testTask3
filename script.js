// Данные всех карточек
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
        title: "Prduct Management Fundamentals",
        category: "management",
        price: "$480",
        author: "Marvin McKinney",
        image: "images/course2.png"
    },
    {
        id: 3,
        title: "HR  Management and Analytics",
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
        author: "by Kathryn Murphy",
        image: "images/course8.png"
    },
    {
        id: 9,
        title: "User Experience. Human-centered Design",
        category: "marketing",
        price: "$240",
        author: "Cody Fisher",
        image: "images/course9.png"
    },
    {
        id: 10,
        title: "User Experience. Human-centered Design",
        category: "marketing",
        price: "$240",
        author: "Cody Fisher",
        image: "images/course9.png"
    },
    {
        id: 11,
        title: "Human Resources – Selection and Recruitment",
        category: "hr",
        price: "$150",
        author: "by Kathryn Murphy",
        image: "images/course8.png"
    },
    {
        id: 12,
        title: "Business Development Management",
        category: "management",
        price: "$400",
        author: "Dianne Russell",
        image: "images/course6.png"
    },
];

// Состояние приложения
const state = {
    currentCategory: 'all',
    searchQuery: '',
    visibleCourses: 9,
    allCourses: courses
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
    
    // Обновляем цифру в "All"
    if (elements.allCount) {
        elements.allCount.textContent = counts.all;
    }
    
    // Обновляем остальные кнопки
    document.querySelectorAll('.tab__count').forEach(countEl => {
        const tab = countEl.closest('.tab');
        const category = tab.dataset.category;
        if (category !== 'all' && counts[category] !== undefined) {
            countEl.textContent = counts[category];
        }
    });
}

// Фильтрация карточек по категории и поиску
function filterCourses() {
    return courses.filter(course => {
        // Фильтр по категории
        const categoryMatch = state.currentCategory === 'all' || 
                            course.category === state.currentCategory;
        
        // Фильтр по поиску
        const searchMatch = !state.searchQuery || 
                           course.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        
        return categoryMatch && searchMatch;
    });
}

// Получение имени категории для отображения
function getCategoryName(categoryKey) {
    const names = {
        marketing: 'Marketing',
        management: 'Management',
        hr: 'HR & Recruting',
        design: 'Design',
        development: 'Development'
    };
    return names[categoryKey] || categoryKey;
}

// Рендер карточек
function renderCourses() {
    const filteredCourses = filterCourses();
    const coursesToShow = filteredCourses.slice(0, state.visibleCourses);
    
    elements.coursesGrid.innerHTML = '';
    
    if (coursesToShow.length === 0) {
        elements.coursesGrid.innerHTML = `
            <div class="no-results">
                <p>No courses found. Try a different search or filter.</p>
            </div>
        `;
        return;
    }
    
    coursesToShow.forEach(course => {
        const card = document.createElement('article');
        card.className = 'course-card';
        card.dataset.category = course.category;
        card.dataset.id = course.id;
        
        // Определяем высоту контента и названия
        const contentHeight = course.category === 'marketing' || 
                            course.category === 'hr' && course.id === 7 || 
                            course.category === 'design' && course.id === 8 ? '150' : '120';
        
        const titleHeight = contentHeight === '150' ? 'two-lines' : 'one-line';
        
        card.innerHTML = `
            <div class="course-card__image">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-card__content course-card__content--${contentHeight}">
                <div class="course-card__badge course-card__badge--${course.category}">
                    ${getCategoryName(course.category)}
                </div>
                <h3 class="course-card__title course-card__title--${titleHeight}">
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
    
    // Обновляем активную кнопку
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('tab--active');
    });
    tab.classList.add('tab--active');
    
    // Обновляем состояние и перерендериваем
    state.currentCategory = category;
    state.visibleCourses = 9;
    renderCourses();
}

// Обработка поиска
function handleSearch(e) {
    state.searchQuery = e.target.value;
    state.visibleCourses = 9;
    renderCourses();
}

// Обработка Load more
function handleLoadMore() {
    state.visibleCourses += 6;
    renderCourses();
}

// Обработчики событий
function setupEventListeners() {
    // Клики по фильтрам
    if (elements.tabs) {
        elements.tabs.addEventListener('click', handleFilterClick);
    }
    
    // Поиск
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }
    
    // Кнопка Load more
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', handleLoadMore);
    }
}

// Инициализация приложения
function init() {
    // Обновляем счетчики
    updateFilterCounts();
    
    // Рендерим начальные карточки
    renderCourses();
    
    // Назначаем обработчики событий
    setupEventListeners();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);