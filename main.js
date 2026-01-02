// Last Updated: 2026-01-02
import './style.css'

const ROKUYO = ['先勝', '友引', '先負', '仏滅', '大安', '赤口'];
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const QUOTES = [
  "千里の道も一歩から",
  "石の上にも三年",
  "笑う門には福来る",
  "七転び八起き",
  "一期一会",
  "継続は力なり",
  "知らぬが仏",
  "急がば回れ",
  "花鳥風月",
  "温故知新"
];

class DailyCalendar {
  constructor() {
    this.currentDate = new Date();
    this.displayDate = new Date(this.currentDate);

    this.elements = {
      currentDay: document.getElementById('current-day'),
      prevDay: document.getElementById('prev-day'),
      year: document.getElementById('year'),
      month: document.getElementById('month'),
      date: document.getElementById('date'),
      weekday: document.getElementById('weekday'),
      rokuyo: document.getElementById('rokuyo'),
      quote: document.getElementById('quote'),
      tearBtn: document.getElementById('tear-btn'),
      app: document.getElementById('app')
    };

    this.init();
  }

  init() {
    this.render(this.displayDate, this.elements.currentDay);
    this.elements.tearBtn.addEventListener('click', () => this.tearOff());
  }

  getRokuyo(date) {
    // Simple approximation for demo purposes
    // In reality, this depends on the lunar calendar
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return ROKUYO[dayOfYear % 6];
  }

  getQuote(date) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return QUOTES[dayOfYear % QUOTES.length];
  }

  render(date, container) {
    // We need to query selectors within the container if we were cloning, 
    // but here we are updating the static elements for the "top" sheet.
    // For the animation, we will clone the top sheet.

    const yearEl = container.querySelector('#year') || document.getElementById('year');
    const monthEl = container.querySelector('#month') || document.getElementById('month');
    const dateEl = container.querySelector('#date') || document.getElementById('date');
    const weekdayEl = container.querySelector('#weekday') || document.getElementById('weekday');
    const rokuyoEl = container.querySelector('#rokuyo') || document.getElementById('rokuyo');
    const quoteEl = container.querySelector('#quote') || document.getElementById('quote');

    yearEl.textContent = date.getFullYear();
    monthEl.textContent = date.getMonth() + 1;
    dateEl.textContent = date.getDate();
    weekdayEl.textContent = WEEKDAYS[date.getDay()];
    rokuyoEl.textContent = this.getRokuyo(date);
    quoteEl.textContent = this.getQuote(date);

    // Reset classes
    container.classList.remove('is-sunday', 'is-saturday');
    if (date.getDay() === 0) {
      container.classList.add('is-sunday');
    } else if (date.getDay() === 6) {
      container.classList.add('is-saturday');
    }
  }

  tearOff() {
    // 1. Clone the current day element to create the "falling" sheet
    const currentSheet = this.elements.currentDay;
    const fallingSheet = currentSheet.cloneNode(true);

    // Position the falling sheet exactly over the current one
    fallingSheet.style.position = 'absolute';
    fallingSheet.style.zIndex = '100';
    fallingSheet.classList.add('tearing');

    // Append to container
    document.querySelector('.calendar-container').appendChild(fallingSheet);

    // 2. Update the "underneath" sheet (the original currentDay element) to the next day
    // We do this immediately but it's covered by the falling sheet for a moment
    this.displayDate.setDate(this.displayDate.getDate() + 1);
    this.render(this.displayDate, currentSheet);

    // 3. Clean up the falling sheet after animation
    fallingSheet.addEventListener('animationend', () => {
      fallingSheet.remove();
    });
  }
}

new DailyCalendar();
