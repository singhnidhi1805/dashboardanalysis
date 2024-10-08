import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  template: `
    <div style="position: relative;">
      <canvas baseChart
        [datasets]="lineChartData"
        [labels]="lineChartLabels"
        [options]="lineChartOptions"
        [legend]="lineChartLegend"
        >
      </canvas>
    </div>
  `
})
export class LineChartComponent implements OnChanges {
  @Input() data: any;

  lineChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Sales',
      borderColor: 'black',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      fill: true
    },
  ];

  lineChartLabels: string[] = [];
  
  lineChartOptions: ChartOptions = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartType = 'line';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.lineChartLabels = this.data.labels;
      this.lineChartData[0].data = this.data.datasets[0].data;
    }
  }
}
