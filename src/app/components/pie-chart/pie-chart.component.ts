import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType, ChartOptions, TooltipItem, ChartData } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  template: `
    <canvas baseChart
      [data]="chartData"
      [labels]="chartLabels"
      [type]="chartType"
      [options]="chartOptions"
      (chartClick)="onChartClick($event)">
    </canvas>
  `
})
export class PieChartComponent implements OnChanges {
  @Input() data: any;
  @Output() drillDown = new EventEmitter<string>();

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            const currentValue = tooltipItem.raw as number;
            const total = this.chartData.datasets[0].data.reduce((acc: number, cur: number) => acc + cur, 0);
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${this.chartLabels[tooltipItem.dataIndex]}: ${currentValue} (${percentage}%)`;
          }
        }
      }
    }
  };

  chartLabels: string[] = [];
  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };
  chartType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartLabels = this.data.labels;
      this.chartData.datasets[0].data = this.data.datasets[0].data; // Set the data for the dataset
    }
  }

  onChartClick(event: any): void {
    if (event.active.length > 0) {
      const label = this.chartLabels[event.active[0].index];
      this.drillDown.emit(label);  // Pass the label directly
    }
  }
}
