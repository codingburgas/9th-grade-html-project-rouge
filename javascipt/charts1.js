const ctx = document.getElementById('doughnut');

if (ctx) {
    const cities = [
        "София", "Пловдив", "Варна", "Бургас", "Русе",
        "Стара Загора", "Плевен"
    ];

    const dataValues = [
        85, 70, 60, 55, 48, 
        40, 35 
    ];

    const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#8A2BE2',
        '#000000'
    ];

    const doughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: cities,
            datasets: [{
                label: 'Брой инциденти',
                data: dataValues,
                backgroundColor: colors.slice(0, cities.length),
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Пожари в България (2025 г.)',
                    color: '#000000' // Example: Change title color to dark grey
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: '#000000' // Example: Change legend label color to grey
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${label}${context.parsed} (${percentage}%)`;
                            }
                            return '';
                        }
                    },
                    titleColor: '#FFFFFF', // Example: Change tooltip title color to white
                    bodyColor: '#DDDDDD'  // Example: Change tooltip body color to light grey
                }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
} else {
    console.error("Canvas element with ID 'doughnut' not found.");
}