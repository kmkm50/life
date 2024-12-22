function addField(sectionId, className, isPeriodic = false) {
    const section = document.getElementById(sectionId);

    // 項目全体のコンテナを作成
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';
    fieldContainer.style.display = 'flex';
    fieldContainer.style.alignItems = 'center';
    fieldContainer.style.marginBottom = '10px';
    fieldContainer.style.gap = '10px';

    // 項目名入力フィールド
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '項目名';
    nameInput.className = `${className}-name`;
    nameInput.style.flex = '1';
    fieldContainer.appendChild(nameInput);

    // 金額入力フィールド
    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.placeholder = '金額 (円)';
    valueInput.className = className;
    valueInput.style.flex = '1';
    fieldContainer.appendChild(valueInput);

    // 回数入力フィールド (必要な場合のみ)
    if (isPeriodic) {
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.placeholder = '回数';
        countInput.className = `${className}-count`;
        countInput.style.flex = '1';
        fieldContainer.appendChild(countInput);
    }

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.style.flex = '0';
    deleteButton.addEventListener('click', () => {
        fieldContainer.remove();
    });
    fieldContainer.appendChild(deleteButton);

    // フィールドコンテナをセクションに追加
    section.appendChild(fieldContainer);
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
        const inputs = document.getElementsByClassName(category.class);
        const counts = category.count ? document.getElementsByClassName(`${category.class}-count`) : null;
        let categoryTotalMonth = 0;
        let categoryTotalYear = 0;

        if (!category.count) {
            // 毎月固定の計算
            for (let i = 0; i < inputs.length; i++) {
                const value = parseFloat(inputs[i].value) || 0;
                categoryTotalMonth += value;
            }
            categoryTotalYear = categoryTotalMonth * 12;
        } else {
            // 年に数回の計算
            for (let i = 0; i < inputs.length; i++) {
                const value = parseFloat(inputs[i].value) || 0;
                const multiplier = parseInt(counts[i]?.value) || 0;
                categoryTotalYear += value * multiplier;
            }
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
            if (totalYearElement) totalYearElement.textContent = `年額: ${Math.floor(categoryTotalYear)}円`;
        }

        if (category.totalMonthId) {
            const totalMonthElement = document.getElementById(category.totalMonthId);
            if (totalMonthElement) totalMonthElement.textContent = `月額: ${Math.floor(categoryTotalMonth)}円`;
        }
    });

    document.getElementById('overall-total-year').textContent = `年額: ${Math.floor(overallTotalYear)}円`;
    document.getElementById('overall-total-month').textContent = `月額: ${Math.floor(overallTotalMonth)}円`;

    document.getElementById('necessary-total-year').textContent = `年額: ${Math.floor(necessaryTotalYear)}円`;
    document.getElementById('necessary-total-month').textContent = `月額: ${Math.floor(necessaryTotalMonth)}円`;

    document.getElementById('enjoyment-total-year').textContent = `年額: ${Math.floor(enjoymentTotalYear)}円`;
    document.getElementById('enjoyment-total-month').textContent = `月額: ${Math.floor(enjoymentTotalMonth)}円`;
}
