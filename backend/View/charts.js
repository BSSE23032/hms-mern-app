document.addEventListener('DOMContentLoaded', function () {
    const total = 30;
    const visited = 18;
    const notVisited = total - visited;
    document.getElementById('total_pat').textContent = total;
    document.getElementById('visited_pat').textContent = visited;
    document.getElementById('not_visited_pat').textContent = notVisited;
   const pie_chart = document.getElementById('taskChart').getContext('2d');
    new Chart(pie_chart, {
        type: 'pie',
        data: {
            labels: ['Visited', 'Not Visited'],
            datasets: [{
                data: [visited, notVisited],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    document.getElementById('taskChart').parentNode.style.height = '300px';
});
