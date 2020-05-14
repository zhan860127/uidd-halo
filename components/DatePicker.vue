<template>
  <div class="picker-root">
    <div class="month-bar">
      <div>
        <b-icon-chevron-left
          style="width: 24px; height: 24px;"
          class="clickable"
          @click="addMonth(-1)"
        />
      </div>
      <div class="months">
        <div class="month">{{ monthNames[(date.getMonth() + 11) % 12] }}</div>
        <div class="month active">{{ monthNames[date.getMonth()] }}</div>
        <div class="month">{{ monthNames[(date.getMonth() + 1) % 12] }}</div>
      </div>
      <div>
        <b-icon-chevron-right
          style="width: 24px; height: 24px;"
          class="clickable"
          @click="addMonth(1)"
        />
      </div>
    </div>
    <div class="calendar">
      <div class="dows">
        <div class="dow">SUN</div>
        <div class="dow">MON</div>
        <div class="dow">TUE</div>
        <div class="dow">WED</div>
        <div class="dow">THU</div>
        <div class="dow">FRI</div>
        <div class="dow">SAT</div>
      </div>
      <div class="days">
        <div
          v-for="d in daysOfMonth"
          :key="d"
          class="day clickable"
          :style="{
            'grid-column-start': d == 1 ? dayOfFirstDayOfMonth + 1 : undefined,
          }"
          @click="onDayClicked(d)"
        >
          {{ d }}
        </div>
      </div>
    </div>
    <div>{{ date }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class classname extends Vue {
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  date: Date = new Date();
  addMonth(m: number) {
    this.date.setMonth(this.date.getMonth() + m);
    this.date = new Date(this.date);
  }

  dateOnDay(day: number): Date {
    const d = new Date(this.date);
    d.setDate(day);
    return d;
  }

  onDayClicked(day: number) {
    const d = this.dateOnDay(day);
    this.date = d;
    this.$emit('input', new Date(d));
  }

  get dayOfFirstDayOfMonth() {
    const d = new Date(this.date);
    d.setDate(1);
    return d.getDay();
  }

  get daysOfMonth() {
    const d = new Date(this.date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.getDate();
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Avenir Book';
  src: url('~assets/font/AvenirLTStd-Book.otf');
}

.clickable {
  cursor: pointer;
  transition: all 100ms ease;
}

.clickable:hover {
  background-color: #0003;
}

.picker-root {
  padding-top: 13px;
  padding-left: 26px;
  padding-right: 26px;
  background-color: #fcf6ef;
  width: 500px;
  user-select: none;
}
.month-bar {
  display: flex;
}
.months {
  font: 20px/27px sans-serif;
  flex: 1;
  display: flex;
}

.month {
  color: #4d6790;
  opacity: 0.7;
  flex-grow: 1;
  text-align: center;
}

.month.active {
  color: #082448;
}

.calendar {
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  color: #082448;
}

.dows {
  display: flex;
  margin-bottom: 14px;
}

.dow {
  flex: 1;
  text-align: center;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 10px;
  place-items: center;
}

.dow,
.day {
  font: 10px/14px sans-serif;
  opacity: 0.7;
}
</style>
