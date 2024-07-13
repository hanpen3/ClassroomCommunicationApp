const voteTitle = document.getElementById('voteTitle');
const pieChart = document.getElementById('pieChart');
const closeButton = document.getElementById('close');


window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        const info = event.data;
        const title = info.title;
        const number = info.number;
        const options = info.options;
        const multi = info.multi;
        const graph = info.graph;
        const result = info.result;
        //innerHTMLを消す

        /*必要な要素を画面に表示(とりあえず円グラフで) */
        const backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(100, 181, 246, 0.2)' 
        ];
        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(100, 181, 246, 1)'
        ];

        const selectBackgroundColor = backgroundColors.slice(0, number);
        const selectBorderColor = borderColors.slice(0, number);
        
        if(multi){
            voteTitle.textContent = "投票のお題: "+title +"（複数選択可）";  
        }else{
            voteTitle.textContent = "投票のお題: "+title + "（単一選択）";  
        }
        const ctx = pieChart.getContext('2d');
        const chartData ={
            labels: options, 
            datasets:[{
                data: result, 
                backgroundColor: selectBackgroundColor,  
                borderColor: selectBorderColor,
                borderWidth: 1
            }]
        };
        const chartOptions = {
            responsive: true, 
            plugins:{
                legend: {
                    position: 'top',
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        if (value === 0) {
                            return ''; // 0人のラベルは表示しない
                        }
                        const dataset = ctx.chart.data.datasets[0];
                        const total = dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${value}人\n(${percentage}%)`;
                    },
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            }
        }
        const myPieChart = new Chart(ctx, {
            type: 'pie', 
            data: chartData, 
            options: chartOptions, 
            plugins: [ChartDataLabels]
        });       

    }
});

//閉じるボタンが押されたとき
closeButton.addEventListener('click', () => {
    window.close();
});