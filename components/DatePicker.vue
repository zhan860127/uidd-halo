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
      <div v-if="date" class="months">
        <div class="month">
          {{ monthNames[(date.getMonth() + 11) % 12] }}
        </div>
        <div class="month active">{{ monthNames[date.getMonth()] }}</div>
        <div class="month">
          {{ monthNames[(date.getMonth() + 1) % 12] }}
        </div>
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
          class="day"
          :style="{
            'grid-column-start': d == 1 ? dayOfFirstDayOfMonth + 1 : undefined,
          }"
        >
          <div
            class="day-before"
            :class="{ highlight: shouldHighlight(d), active: isActive(d) }"
            @click="onDayClicked(d)"
          ></div>
          <div class="day-content">{{ d }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator';

@Component({})
export default class classname extends Vue {
  @Model('input') date!: Date;
  @Prop({ default: () => [] }) readonly highlighted!: Date[];

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

  addMonth(m: number) {
    const d = new Date(this.date);
    d.setMonth(d.getMonth() + m);
    this.$emit('input', d);
  }

  dateOnDay(day: number): Date {
    const d = new Date(this.date);
    d.setDate(day);
    return d;
  }

  onDayClicked(day: number) {
    const d = this.dateOnDay(day);
    this.$emit('input', new Date(d));
  }

  get dayOfFirstDayOfMonth() {
    const d = new Date(this.date);
    d.setDate(1);
    return d.getDay();
  }

  get daysOfMonth() {
    const m = this.date.getMonth() + 1;
    const y = this.date.getFullYear();
    if (m === 2) return !(y % 4 || (!(y % 100) && y % 400)) ? 29 : 28;
    return [1, 3, 5, 7, 8, 10, 12].some((x) => m === x) ? 31 : 30;
  }

  shouldHighlight(day: number): boolean {
    const d = new Date(this.date);
    d.setDate(day);
    return this.highlighted.some(
      (dd) =>
        d.getDate() === dd.getDate() &&
        d.getMonth() === dd.getMonth() &&
        d.getFullYear() === dd.getFullYear()
    );
  }

  isActive(day: number): boolean {
    const d = new Date(this.date);
    d.setDate(day);
    const dd = this.date;
    return (
      d.getDate() === dd.getDate() &&
      d.getMonth() === dd.getMonth() &&
      d.getFullYear() === dd.getFullYear()
    );
  }
}
</script>

<style scoped lang="scss">
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
  min-width: 300px;
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
  height: 180px;
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

.day {
  position: relative;
}

.day-before {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2em;
  height: 2em;
  border-radius: 50%;
  z-index: -1;

  &.highlight {
    border: 1px solid #fabf4d;
  }

  &.active {
    background-color: #b51e41;
    opacity: 0.65;
  }
}

.day-content {
  pointer-events: none;
}
</style>
