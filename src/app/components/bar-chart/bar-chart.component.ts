import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

@Component({
  selector: 'app-bar-chart',
  template: `
    <canvas baseChart
      [datasets]="chartData"
      [labels]="chartLabels"
      [options]="chartOptions"
      [legend]="chartLegend"
      [type]="chartType">
    </canvas>
  `
})
export class BarChartComponent implements OnChanges {
  @Input() data: any;

  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true // Updated for Chart.js v3+
      },
      y: {
        beginAtZero: true // Updated for Chart.js v3+
      }
    },
    plugins: {
      datalabels: { // Configure the datalabels plugin here
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => value.toString() // Format the label
      }
    }
  };

  chartLabels: string[] = []; // Changed to string[]
  chartType: ChartType = 'bar';
  chartLegend = true;
  chartData: ChartDataset[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartLabels = this.data.labels;
      this.chartData = this.data.datasets;
    }
  }
}

