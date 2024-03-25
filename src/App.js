import { useState } from 'react';
import Chart from 'react-apexcharts';
import { format, parse } from 'date-fns';
import data from './data'; // assuming this is where your data is imported from
import './App.css';

const dateFormat = 'dd-MM-yyyy';
data.forEach((entry) => entry.date = parse(entry.date, dateFormat, new Date()));

function App() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSource, setSelectedSource] = useState('insa');

  const orderedData = data
    .filter((entry) => entry.source === selectedSource)
    .filter((entry) => {
      const year = format(entry.date, 'yyyy');
      return ['all', year].includes(selectedYear);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const uniqueBiannual = [];
  const biannualYears = orderedData.map((entry) => {
    const month = format(entry.date, 'MM');
    const year = format(entry.date, 'yyyy');

    if (parseInt(month) % 6 === 0) {
      const biannual = `${month}-${year}`;
      if (!uniqueBiannual.includes(biannual)) {
        uniqueBiannual.push(biannual);
        return year;
      }
    }

    return '';
  });

  // Define available years and sources
  const years = ['2020', '2021', '2022', '2023'];
  const sources = [...new Set(data.map(item => item.source))];
  const options = {
    chart: {
      id: 'party-popularity'
    },
    xaxis: {
      categories: biannualYears,
      axisTicks: {
        show: true,
      },
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return Math.floor(value) + '%';
        },
      },
    },
  };

  // Series data for the chart
  const series = [
    { name: 'AfD', data: orderedData.map((entry) => entry.values.afd), color: '#95c5dd' },
    { name: 'Union', data: orderedData.map((entry) => entry.values.cdu_csu), color: '#000000' },
    { name: 'FDP', data: orderedData.map((entry) => entry.values.fdp), color: '#ffe17f' },
    { name: 'Grüne', data: orderedData.map((entry) => entry.values.gruene), color: '#009456' },
    { name: 'Linke', data: orderedData.map((entry) => entry.values.linke), color: '#d04e84' },
    { name: 'SPD', data: orderedData.map((entry) => entry.values.spd), color: '#f15b67' },
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  return (
    <div className='graphic-wrapper'>
      <div className='content-wrapper'>
        <div className='graphic'>
          <div className='graphic-header'>
            <h2 className='graphic-headline'>
              <img className='graphic-headline-icon'
                src='https://assets.graphic-portal.com/spaces/-Ns4Y6W9ApHcBTBEzu9S/graphics/-NsNham4iKudej0xLINo/versions/-NsNhi7ANB5ZktQHydB2/main/bundestag.png'
                alt=''
              />
              Sonntagsfragen zur Bundestagswahl
            </h2>
          </div>
          <div className='graphic-container'>
            <div className='graphic-container-selectors'>
              <div className='graphic-select-wrapper'>
                <select value={selectedYear} onChange={handleYearChange} autoComplete='off'>
                  <option value='' disabled defaultValue>
                    Select a year
                  </option>
                  <option value='all'>
                    All
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className='graphic-select-wrapper'>
                <select value={selectedSource} onChange={handleSourceChange} autoComplete='off'>
                  <option value='' disabled defaultValue>
                    Select a source
                  </option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='graphic-container-canvas'>
              <Chart
                options={options}
                series={series}
                type='line'
                width='100%'
                height='400'
              />
            </div>
          </div>
        </div>
        <footer className='footer'>
          <div className='main-row'>
            <button className='button info-button'>
              <img src='https://assets.graphic-portal.com/spaces/-Ns4Y6W9ApHcBTBEzu9S/graphics/-NsNham4iKudej0xLINo/versions/-NsNhi7ANB5ZktQHydB2/main/info-button.svg' alt='Info' />
            </button>
            <div className='footer-copy'>
              Infratest dimap, Forsa, Forschungsgruppe Wahlen, Kantar, Insa
            </div>
            <div className='footer-spacer'></div>
            <a className='footer-logo' href='http://u.afp.com/interactive-graphics' target='_blank' rel='noreferrer'>
              <img className='company-icon' src='https://assets.graphic-portal.com/spaces/-Ns4Y6W9ApHcBTBEzu9S/graphics/-NsNham4iKudej0xLINo/versions/-NsNhi7ANB5ZktQHydB2/main/logo.svg' alt='Logo' />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
