# Bigyellowfish Employee Wellbeing Web Frontend

## Overview

This project is an Angular-based web frontend for Bigyellowfish's employee wellbeing platform. It includes features such as user authentication, an analytics dashboard with various charts, and data visualization of employee wellbeing metrics.

## Features

- User authentication (login/logout)
- Analytics dashboard with the following charts:
  - Category distribution (Pie chart with drill-down functionality)
  - Monthly sales trend (Line chart)
  - Region-wise sales by segment (Bar chart)
  - Top 10 profitable cities (Bar chart)
  - Top 10 loss-making cities (Bar chart)
  - Quantity by ship mode (Pie chart)
- Responsive design for various screen sizes
- Error handling and loading indicators

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or later)
- npm (v6.x or later)
- Angular CLI (v12.x or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/bigyellowfish-wellbeing-frontend.git
   cd bigyellowfish-wellbeing-frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Install the required chart libraries:
   ```
   npm install ng2-charts chart.js @types/chart.js
   ```

## Configuration

1. Open `src/environments/environment.ts` and `src/environments/environment.prod.ts`
2. Update the `apiUrl` if necessary to point to the correct backend API endpoint

## Running the Application

To run the application in development mode:

```
ng serve
```

Navigate to `http://localhost:4200/` in your web browser. The app will automatically reload if you change any of the source files.

## Building for Production

To build the project for production:

```
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── charts/
│   │       ├── pie-chart/
│   │       ├── bar-chart/
│   │       └── line-chart/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── data.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── csv-data.model.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.css
│   ├── app.module.ts
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── assets/
├── index.html
└── styles.css
```

## Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to the Bigyellowfish team for the opportunity to work on this project
- [Angular](https://angular.io/)
- [ng2-charts](https://valor-software.com/ng2-charts/)
- [Chart.js](https://www.chartjs.org/)

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact the Bigyellowfish IT support team.
