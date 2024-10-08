import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { CSVData } from '../../models/csv-data.model';

// Importing Chart.js components
import { Chart, PieController, BarController, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, BarElement, PointElement, LineElement } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  csvData: CSVData[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  categoryData: any;
  salesTrendData: any;
  regionSalesData: any;
  topProfitableCitiesData: any;
  topLossMakingCitiesData: any;
  shipModeData: any;

  chartsData: { title: string, type: string, data: any }[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Register the chart controllers and elements
    Chart.register(
      PieController,
      BarController,
      LineController,
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      BarElement,
      PointElement,
      LineElement
    );

    this.loadCSVData();
  }


  loadCSVData(): void {
    this.isLoading = true;
    this.error = null;
    this.dataService.getCSVData().subscribe(
      data => {
        if (data.length > 0) {
          this.csvData = data;
          this.processData(); // Only process data if it's non-empty
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching CSV data:', error);
        this.error = 'Failed to load data. Please try again later.';
        this.isLoading = false;
      }
    );
  }
  
  processData(): void {
    this.processCategoryData();
    this.processSalesTrendData();
    this.processRegionSalesData();
    this.processProfitableCitiesData();
    this.processShipModeData();

    // Use a Set to hold unique titles
    const titlesSet = new Set<string>();

    this.chartsData = [];

    // Check and add charts data only if the title is unique
    const addChartData = (title: string, type: string, data: any) => {
        if (!titlesSet.has(title)) {
            titlesSet.add(title);
            this.chartsData.push({ title, type, data });
        }
    };

    addChartData('Category Distribution', 'pie', this.categoryData);
    addChartData('Monthly Sales Trend', 'line', this.salesTrendData);
    addChartData('Regional Sales', 'bar', this.regionSalesData);
    addChartData('Top Profitable Cities', 'bar', this.topProfitableCitiesData);
    addChartData('Top Loss-Making Cities', 'bar', this.topLossMakingCitiesData);
    addChartData('Shipping Modes', 'pie', this.shipModeData);
}
  processCategoryData(): void {
    const categoryCount: { [key: string]: number } = {};
    this.csvData.forEach(row => {
      categoryCount[row.Category] = (categoryCount[row.Category] || 0) + 1;
    });
    this.categoryData = {
      labels: Object.keys(categoryCount),
      datasets: [{
        data: Object.values(categoryCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    };
  }

  onCategoryDrillDown(category: string): void {
    // Process the category for drill down
    const subCategories = this.csvData
      .filter(row => row.Category === category)
      .reduce((acc: { [key: string]: number }, row) => {
        acc[row['Sub-Category']] = (acc[row['Sub-Category']] || 0) + 1;
        return acc;
      }, {});

    this.categoryData = {
      labels: Object.keys(subCategories),
      datasets: [{
        data: Object.values(subCategories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }]
    };
  }

  processSalesTrendData(): void {
    const monthlySales: { [key: string]: number } = {};
    this.csvData.forEach(row => {
      const date = new Date(row['Order Date']);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + parseFloat(row.Sales);
    });
    this.salesTrendData = {
      labels: Object.keys(monthlySales),
      datasets: [{
        label: 'Monthly Sales',
        data: Object.values(monthlySales),
        borderColor: '#4BC0C0',
        fill: false
      }]
    };
  }

  processRegionSalesData(): void {
    const regionSales: { [key: string]: { [key: string]: number } } = {};
    this.csvData.forEach(row => {
      if (!regionSales[row.Region]) {
        regionSales[row.Region] = {};
      }
      regionSales[row.Region][row.Segment] = (regionSales[row.Region][row.Segment] || 0) + parseFloat(row.Sales);
    });
    const labels = Object.keys(regionSales);
    const datasets = Object.keys(regionSales[labels[0]]).map(segment => ({
      label: segment,
      data: labels.map(region => regionSales[region][segment] || 0),
      backgroundColor: this.getRandomColor()
    }));
    this.regionSalesData = { labels, datasets };
  }

  processProfitableCitiesData(): void {
    const cityProfits: { [key: string]: number } = {};
    this.csvData.forEach(row => {
      cityProfits[row.City] = (cityProfits[row.City] || 0) + parseFloat(row.Profit);
    });
    const sortedCities = Object.entries(cityProfits).sort((a, b) => b[1] - a[1]);
    this.topProfitableCitiesData = {
      labels: sortedCities.slice(0, 10).map(([city]) => city),
      datasets: [{
        label: 'Profit',
        data: sortedCities.slice(0, 10).map(([, profit]) => profit),
        backgroundColor: '#36A2EB'
      }]
    };
    this.topLossMakingCitiesData = {
      labels: sortedCities.slice(-10).reverse().map(([city]) => city),
      datasets: [{
        label: 'Loss',
        data: sortedCities.slice(-10).reverse().map(([, profit]) => -profit),
        backgroundColor: '#FF6384'
      }]
    };
  }

  processShipModeData(): void {
    const shipModeCount: { [key: string]: number } = {};
    this.csvData.forEach(row => {
      shipModeCount[row['Ship Mode']] = (shipModeCount[row['Ship Mode']] || 0) + parseInt(row.Quantity);
    });
    this.shipModeData = {
      labels: Object.keys(shipModeCount),
      datasets: [{
        data: Object.values(shipModeCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
