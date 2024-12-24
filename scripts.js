window.onload = function initializePage() {
    // 記入例を自動入力
    fillExamples();

    // 記入例を基に合計金額を計算
    calculateTotal();
};

function fillExamples() {
    const necessaryFixedExamples = [
        { selector: '.necessary-fixed', values: [60000, 20000, 4000, 4000, 2000, 3000, 4000, 5000, 10000, 13000, 23000, 1500] }
    ];

    const enjoymentFixedExamples = [
        { selector: '.enjoyment-fixed', values: [20000, 5000, 0, 2000,30000] }
    ];

    const necessaryPeriodicExamples = [
        { selector: '.necessary-periodic', values: [2000, 1000] },
        { selector: '.necessary-periodic-count', values: [6, 10] }
    ];

    const enjoymentPeriodicExamples = [
        { selector: '.enjoyment-periodic', values: [10000, 5000, 5000, 20000, 10000, 40000, 2000, 50000] },
        { selector: '.enjoyment-periodic-count', values: [6, 6, 6, 6, 4, 2, 6, 1] }
    ];

    const setValues = (examples) => {
        examples.forEach((example) => {
            const inputs = document.querySelectorAll(example.selector);
            inputs.forEach((input, index) => {
                input.value = example.values[index] || ''; // 記入例があれば入力
            });
        });
    };

    setValues(necessaryFixedExamples);
    setValues(enjoymentFixedExamples);
    setValues(necessaryPeriodicExamples);
    setValues(enjoymentPeriodicExamples);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calculateTotal() {
    const categories = [
        { class: 'necessary-fixed', count: false, totalYearId: 'fixed-total-year', totalMonthId: 'fixed-total-month' },
        { class: 'enjoyment-fixed', count: false, totalYearId: 'enjoyment-fixed-total-year', totalMonthId: 'enjoyment-fixed-total-month' },
        { class: 'necessary-periodic', count: true, totalYearId: 'periodic-total-year', totalMonthId: 'periodic-total-month' },
        { class: 'enjoyment-periodic', count: true, totalYearId: 'enjoyment-periodic-total-year', totalMonthId: 'enjoyment-periodic-total-month' }
    ];

    let overallTotalYear = 0;
    let overallTotalMonth = 0;
    let necessaryTotalYear = 0;
    let necessaryTotalMonth = 0;
    let enjoymentTotalYear = 0;
    let enjoymentTotalMonth = 0;

    categories.forEach((category) => {
        const inputs = document.querySelectorAll(`.${category.class}`);
        const counts = category.count ? document.querySelectorAll(`.${category.class}-count`) : null;
        let categoryTotalMonth = 0;
        let categoryTotalYear = 0;

        if (!category.count) {
            inputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                categoryTotalMonth += value;
            });
            categoryTotalYear = categoryTotalMonth * 12;
        } else {
            inputs.forEach((input, index) => {
                const value = parseFloat(input.value) || 0;
                const multiplier = parseInt(counts[index]?.value) || 0;
                categoryTotalYear += value * multiplier;
            });
            categoryTotalMonth = Math.floor(categoryTotalYear / 12);
        }

        overallTotalYear += categoryTotalYear;
        overallTotalMonth += categoryTotalMonth;

        if (category.class.includes('necessary')) {
            necessaryTotalYear += categoryTotalYear;
            necessaryTotalMonth += categoryTotalMonth;
        } else if (category.class.includes('enjoyment')) {
            enjoymentTotalYear += categoryTotalYear;
            enjoymentTotalMonth += categoryTotalMonth;
        }

        if (category.totalYearId) {
            const totalYearElement = document.getElementById(category.totalYearId);
            if (totalYearElement) totalYearElement.textContent = `${formatNumber(Math.floor(categoryTotalYear))}円/年`;
        }

        if (category.totalMonthId) {
            const totalMonthElement = document.getElementById(category.totalMonthId);
            if (totalMonthElement) totalMonthElement.textContent = `${formatNumber(Math.floor(categoryTotalMonth))}円/月`;
        }
    });

    document.getElementById('overall-total-year').textContent = `${formatNumber(Math.floor(overallTotalYear))}円/年`;
    document.getElementById('overall-total-month').textContent = `${formatNumber(Math.floor(overallTotalMonth))}円/月`;

    document.getElementById('necessary-total-year').textContent = `${formatNumber(Math.floor(necessaryTotalYear))}円/年`;
    document.getElementById('necessary-total-month').textContent = `${formatNumber(Math.floor(necessaryTotalMonth))}円/月`;

    document.getElementById('enjoyment-total-year').textContent = `${formatNumber(Math.floor(enjoymentTotalYear))}円/年`;
    document.getElementById('enjoyment-total-month').textContent = `${formatNumber(Math.floor(enjoymentTotalMonth))}円/月`;
}

function addField(sectionId, className, isPeriodic = false) {
    const section = document.getElementById(sectionId);

    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '項目名';
    nameInput.className = `${className}-name`;
    fieldContainer.appendChild(nameInput);

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.placeholder = '金額 (円)';
    valueInput.className = className;
    fieldContainer.appendChild(valueInput);

    if (isPeriodic) {
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.placeholder = '回数';
        countInput.className = `${className}-count`;
        fieldContainer.appendChild(countInput);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
        fieldContainer.remove();
        calculateTotal(); // 再計算
    });
    fieldContainer.appendChild(deleteButton);

    section.appendChild(fieldContainer);
}
